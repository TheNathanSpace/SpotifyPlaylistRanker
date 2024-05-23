import React, {useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import {GET_RANKING_OPTIONS, SUBMIT_RANKING} from "../util/addresses";
import RankingOption from "./RankingOption";

const RankingWizard = (props) => {

    const [previewVolume, setPreviewVolume] = useState(0.5);

    const [options, setOptions] = useState([
        {
            album_uri: null,
            album_name: null,
            album_image_b64: null,
            track_uri: null,
            track_name: null,
            audio_preview_url: null,
            artist_uri: null,
            artist_name: null,
            artist_image_b64: null,
        },
        {
            album_uri: null,
            album_name: null,
            album_image_b64: null,
            track_uri: null,
            track_name: null,
            audio_preview_url: null,
            artist_uri: null,
            artist_name: null,
            artist_image_b64: null,
        }
    ]);

    const firstRender = useRef(true);
    const [imageMap, setImageMap] = useState(new Map());

    const [optionsClickable, setOptionsClickable] = useState(true);
    const blockClicking = useRef(false);

    const fetchURLImage = async (uri, image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return {uri: uri, image_url: url}
    }

    const base64ToBlobURL = async (optionsData) => {
        const promiseMap = new Map();
        optionsData.forEach((t) => {
            promiseMap.set(t.album_uri, fetchURLImage(t.album_uri, `data:image/png;base64,${t.album_image_b64}`));
            promiseMap.set(t.artist_uri, fetchURLImage(t.artist_uri, `data:image/png;base64,${t.artist_image_b64}`));
        });
        const newImageMap = new Map();
        await Promise.allSettled(promiseMap.values()).then(async (promiseResults) => {
            promiseResults.forEach(r => newImageMap.set(r.value.uri, r.value.image_url));
        });
        return newImageMap;
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false // toggle flag after first render/mounting
            return;
        }

        (async () => {
            const newImageMap = await base64ToBlobURL(options);
            setImageMap(newImageMap);
        })();
    }, [options]);

    const getOptions = async () => {
        const urlParams = {
            playlist_uri: props.playlist_uri,
            token: props.token
        }
        const target = GET_RANKING_OPTIONS + "?" + new URLSearchParams(urlParams).toString();
        const response = await (await fetch(target)).json();

        if (response.valid) {
            setOptions(response.options);
            setOptionsClickable(true);
            blockClicking.current = false;
        }
    };

    // Initial load: get options
    useEffect(() => {
        (async () => {
            await getOptions();
        })();
    }, []);

    const submitWin = async (winnerIndex) => {
        const urlParams = {
            token: props.token,
            playlist_uri: props.playlist_uri,
            track_a_uri: options[0].track_uri,
            track_b_uri: options[1].track_uri,
            a_wins: winnerIndex == 0
        }

        const target = SUBMIT_RANKING + "?" + new URLSearchParams(urlParams).toString();
        await fetch(target);
    };

    const selectOption = async (chosenTrackURI) => {
        if (blockClicking.current) {
            return;
        }
        blockClicking.current = true;
        setOptionsClickable(false);

        let chosenIndex;
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.track_uri === chosenTrackURI) {
                chosenIndex = i;
                break;
            }
        }
        submitWin(chosenIndex);
        await getOptions();
    };

    return (
        <div className={"hor-centered ranking-wizard"}>

            <RankingOption optionsClickable={optionsClickable} selectOption={selectOption} imageMap={imageMap}
                           optionData={options[0]} previewVolume={previewVolume} setPreviewVolume={setPreviewVolume}/>

            <div className={"vert-centered"}>
                <div className={"ranking-instruction hor-centered-text"}>
                    Choose the better track!
                </div>
            </div>

            <RankingOption optionsClickable={optionsClickable} selectOption={selectOption} imageMap={imageMap}
                           optionData={options[1]} previewVolume={previewVolume} setPreviewVolume={setPreviewVolume}/>
        </div>
    );
};

RankingWizard.props = {
    playlist_uri: PropTypes.string,
    token: PropTypes.any
}

export default RankingWizard;