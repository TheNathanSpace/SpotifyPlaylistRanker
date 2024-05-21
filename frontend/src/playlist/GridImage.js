import React from 'react';
import PropTypes from "prop-types";

const GridImage = (props) => {
    return (
        <div className={"hor-centered vert-centered full-height"}>
            <img className={"grid-album-image"} src={props.value.album_image}
                 alt={`${props.value.album_name} cover`}
            />
        </div>
    );
};

GridImage.props = {
    value: PropTypes.any,
}

export default GridImage;