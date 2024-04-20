import React from 'react';
import PropTypes from 'prop-types';

ValidationError.propTypes = {
    field: PropTypes.string,
    message: PropTypes.string
};

function ValidationError(props) {
    return (
        <div>
            <p>Error in {props.field}: {props.message}</p>
        </div>
    );
}

export default ValidationError;