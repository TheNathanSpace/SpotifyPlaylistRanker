import React from 'react';
import PropTypes from "prop-types";

const ToggleRankingButton = (props) => {
    return (
        <>
            {
                props.isRanking ?
                    <span>Interactive track ranking menu</span>
                    :
                    <span>Tracks as ranked by current user</span>
            }
        </>
    );
}

ToggleRankingButton.props = {
    isRanking: PropTypes.any
}

export default ToggleRankingButton;