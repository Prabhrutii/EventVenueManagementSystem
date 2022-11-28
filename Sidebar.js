import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';




const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  }
});

function Sidebar(){
  const classes = useStyles();
  

  return (
      <div>
        <h2>Chat</h2>
            <Grid item xs={18} >
            {/* <Typography variant="h5" className="header-message">Chat</Typography> */}
            </Grid>
       
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={12} className={classes.borderRight500}>
                <List>
                    <ListItem button key="Madison Peter">
                        <ListItemIcon>
                        <Avatar alt="Madison Peter" src="https://material-ui.com/static/images/avatar/4.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Madison Peter"></ListItemText>
                    </ListItem>
                </List>
                <h2>Users</h2>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                </Grid>
                <Divider />
                <List>
                    <ListItem button key="RemySharp">
                        <ListItemIcon>
                            <Avatar alt="John Doe" src="https://material-ui.com/static/images/avatar/1.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="John Doe">John Doe</ListItemText>
                        <ListItemText secondary="online" align="right"></ListItemText>
                    </ListItem>
                    <ListItem button key="Alice">
                        <ListItemIcon>
                            <Avatar alt="Alice" src="https://material-ui.com/static/images/avatar/3.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Alice">Alice</ListItemText>
                    </ListItem>
                    <ListItem button key="CindyBaker">
                        <ListItemIcon>
                            <Avatar alt="Cindy Baker" src="https://material-ui.com/static/images/avatar/2.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
                    </ListItem>
                </List>
                <h2>Groups</h2>
                <Divider />
                <Grid item xs={12} style={{padding: '10px'}}>
                    <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
                </Grid>
                <ListItem button key="Music">
                        <ListItemIcon>
                            <Avatar alt="Music" src="https://material-ui.com/static/images/avatar/5.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Music">Music</ListItemText>
                    </ListItem>
                    <ListItem button key="Sports">
                        <ListItemIcon>
                            <Avatar alt="Sports" src="https://material-ui.com/static/images/avatar/6.jpg" />
                        </ListItemIcon>
                        <ListItemText primary="Sports">Sports</ListItemText>
                    </ListItem>
                <Divider />
            </Grid>
            </Grid>
            </div>
  )}
export default Sidebar;
