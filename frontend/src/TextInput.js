import React     from 'react';
import PropTypes from 'prop-types';

TextInput.propTypes = {
    prompt: PropTypes.string,
    valueRef: PropTypes.any
};

function TextInput(props) {

    return (
        <div>
            <div className={"vert-centered"}>
                <p className={"inline-child"}>{props.prompt}</p><input type={"text"}
                                                                       className={"inline-child"}
                                                                       onChange={(event) => {
                                                                           props.valueRef.current = event.target.value;
                                                                       }}/>
            </div>
        </div>
    );
}

export default TextInput;