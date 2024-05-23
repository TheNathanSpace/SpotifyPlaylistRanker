import React, {useEffect, useRef} from 'react';
import PropTypes from "prop-types";

const RankingOption = (props) => {

    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = props.previewVolume;
        }
    }, [props.previewVolume]);

    const audioRefCallback = (e) => {
        if (e) {
            audioRef.current = e;
            e.volume = props.previewVolume;
        }
    };

    return (
        <div className={"ranking-option" + (props.optionsClickable ? " clickable" : "")}
             onClick={() => props.selectOption(props.optionData.track_uri)}>
            <div>
                <img className={"ranking-image"} src={props.imageMap.get(props.optionData.album_uri)}
                     alt={"Option 1 cover"}/>
            </div>
            <span
                className={"ranking-option-row hor-centered-text ranking-option-track-name"}>{props.optionData.track_name}</span>
            <div className={"hor-centered vert-centered ranking-option-row"}>
                <img className={"ranking-artist-image"} src={props.imageMap.get(props.optionData.artist_uri)}
                     alt={"Option 1 artist"}/>
                <span className={"ranking-artist-name"}>{props.optionData.artist_name}</span>
            </div>
            <span
                className={"ranking-option-row hor-centered-text ranking-option-album-name"}>{props.optionData.album_name}</span>
            <div className={"ranking-option-row audio-preview"}>
                {props.optionData.audio_preview_url ?
                    <audio src={props.optionData.audio_preview_url} controls={true} autoPlay={false}
                           ref={audioRefCallback}
                           onVolumeChange={(event) => {
                               props.setPreviewVolume(event.target.volume)
                           }}/> : <></>}
            </div>
            {!props.optionsClickable ? <div className={"grey-overlay"}/> : <></>}
        </div>
    );
};

RankingOption.props = {
    optionsClickable: PropTypes.any,
    selectOption: PropTypes.any,
    imageMap: PropTypes.any,
    optionData: PropTypes.any,
    previewVolume: PropTypes.any,
    setPreviewVolume: PropTypes.any
}

export default RankingOption;