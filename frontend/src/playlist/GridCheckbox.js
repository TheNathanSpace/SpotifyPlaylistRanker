import React from 'react';
import PropTypes from "prop-types";

const GridCheckbox = (props) => {
    return (
        <div className={"hor-centered vert-centered full-height"}>
            <input className={"grid-deleted-checkbox"} type="checkbox" disabled="disabled"
                   checked={props.value.deleted}/>
        </div>
    );
};

GridCheckbox.props = {
    value: PropTypes.any,
}

export default GridCheckbox;