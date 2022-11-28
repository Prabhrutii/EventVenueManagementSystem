import React from 'react';
import Sidebar from '../src/Sidebar';
import MessageForm from '../src/MessageForm';

import {Grid} from '@material-ui/core';

function Chat() {
    return (
       
        <Grid container>
        <Grid item md={4} >
        <Sidebar/>
     </Grid>
     <Grid item md={8}>
        <MessageForm/>
     </Grid>
        </Grid>



    )
}

export default Chat;
