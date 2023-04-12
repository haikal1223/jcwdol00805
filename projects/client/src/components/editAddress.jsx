import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react';

const EditAddress = ({ addressData, handleSave, handleCancel, isEditing }) => {
    const [editedAddress, setEditedAddress] = React.useState(addressData);

    const handleChange = (e) => {
        setEditedAddress({ ...editedAddress, [e.target.name]: e.target.value });
    };

    return (
        <>
        </>

    );
}

export default EditAddress