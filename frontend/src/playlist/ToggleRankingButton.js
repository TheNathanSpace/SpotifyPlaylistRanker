import React, {useEffect, useState} from 'react';
import {Button} from "@mui/joy";
import PropTypes from "prop-types";

const ToggleRankingButton = (props) => {
    const [labelIndex, setLabelIndex] = useState(0)

    const toggleRanking = () => {
        const newLabelIndex = labelIndex ^ 1;
        setLabelIndex(newLabelIndex);
        props.setIsRanking(Boolean(newLabelIndex));
    }

    const labels = ["Start ranking!", "Stop ranking"];
    return (
        <Button
            className={"start-ranking-button"}
            color="primary"
            variant="solid"
            onClick={() => {
                toggleRanking()
            }}
        >
            {labels[labelIndex]}
        </Button>
    );
}

ToggleRankingButton.props = {
    setIsRanking: PropTypes.any,
}

export default ToggleRankingButton;