import React, {useEffect, useRef, useState} from 'react';
import PropTypes from "prop-types";
import {GET_RANKING_OPTIONS, SUBMIT_RANKING} from "../util/addresses";

const RankingWizard = (props) => {

    const [options, setOptions] = useState([
        {
            album_uri: null,
            album_name: null,
            album_image_b64: null,
            track_uri: null,
            track_name: null,
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
        const imageMap = new Map();
        await Promise.allSettled(promiseMap.values()).then(async (promiseResults) => {
            promiseResults.forEach(r => imageMap.set(r.value.uri, r.value.image_url));
        });
        return imageMap;
    }

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false // toggle flag after first render/mounting
            return;
        }

        (async () => {
            const imageMap = await base64ToBlobURL(options);
            setImageMap(imageMap);
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

    const selectOption = async (optionIndex) => {
        if (blockClicking.current) {
            return;
        }
        blockClicking.current = true;
        setOptionsClickable(false);
        submitWin(optionIndex);
        await getOptions();
    };

    return (
        <div className={"hor-centered ranking-wizard"}>

            <div className={"ranking-option" + (optionsClickable ? " clickable" : "")}
                 onClick={() => selectOption(0)}>
                <div>
                    <img className={"ranking-image"} src={imageMap.get(options[0].album_uri)}
                         alt={"Option 1 cover"}/>
                </div>
                <span className={"ranking-option-row hor-centered-text"}>{options[0].track_name}</span>
                <div className={"hor-centered vert-centered ranking-option-row"}>
                    <img className={"ranking-artist-image"} src={imageMap.get(options[0].artist_uri)}
                         alt={"Option 1 artist"}/>
                    <span className={"ranking-artist-name"}>{options[0].artist_name}</span>
                </div>
                <span className={"ranking-option-row hor-centered-text"}>{options[0].album_name}</span>
                {!optionsClickable ? <div className={"grey-overlay"}/> : <></>}
            </div>

            <div className={"vert-centered"}>
                <div className={"ranking-instruction hor-centered-text"}>
                    Choose the better track!
                </div>
            </div>

            <div className={"ranking-option" + (optionsClickable ? " clickable" : "")} onClick={() => selectOption(1)}>
                <div>
                    <img className={"ranking-image"} src={imageMap.get(options[1].album_uri)} alt={"Option 1 cover"}/>
                </div>
                <span className={"ranking-option-row hor-centered-text"}>{options[1].track_name}</span>
                <div className={"hor-centered vert-centered ranking-option-row"}>
                    <img className={"ranking-artist-image"} src={imageMap.get(options[1].artist_uri)}
                         alt={"Option 1 artist"}/>
                    <span className={"ranking-artist-name"}>{options[1].artist_name}</span>
                </div>
                <span className={"ranking-option-row hor-centered-text"}>{options[1].album_name}</span>
                {!optionsClickable ? <div className={"grey-overlay"}/> : <></>}
            </div>
        </div>
    );
};

RankingWizard.props = {
    playlist_uri: PropTypes.string,
    token: PropTypes.any
}

export default RankingWizard;