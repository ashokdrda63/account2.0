import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BrowserRouter as Router, Link } from 'react-router-dom';



const navItems = [{ main: 'Standred Swift', sub: [{ pathName: "Scheme entry", path: "/Scheme-Entries" }, { pathName: "Account entry", path: "/Bud-Acc-Entries" },{ pathName: "OB entry", path: "/Bud-Acc-Scheme-Entries" },{ pathName: "OBmaster Entry", path: "/OBmaster-Entries" }] },
{ main: 'Normal Swift', sub: [{ pathName: "Voucher entry", path: "/Voucher-Entry" }, { pathName: "Voucher edit", path: "/voucher-Edit" }, { pathName: "Voucher Query", path: "/2-3" }] },
{ main: 'Print Swift', sub: [{ pathName: "Trial Balance", path: "/Voucher-Entry" }, { pathName: "Day Book", path: "/DayBook" }, { pathName: "Consilated Trail Book", path: "ConsTrailBook" }] },
{ main: 'Query Swift', sub: [{ pathName: "Day Book Close", path: "/Voucher-Entry" }, { pathName: "Financial Year Close", path: "/2-2" }] }
];

function Header() {

    const [anchorEl, setAnchorEl] = React.useState(new Array(navItems.length).fill(null));

    const handleClick = (event, index) => {
        // console.log('event.currentTarget', event.currentTarget, index);
        let selectedAchorEl = [...anchorEl]
        selectedAchorEl[index] = event.currentTarget
        setAnchorEl(selectedAchorEl);
    };
    const handleClose = (event, index) => {
        let unSelectedAchorEl = [...anchorEl]
        unSelectedAchorEl[index] = null
        setAnchorEl(unSelectedAchorEl)
    };


    return (
        
        <div>
            <AppBar component="nav" >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component="div"
                    >
                        ACCOUNT +
                    </Typography>
                    <Box sx={{}}>
                        {navItems.map((item, index) => (
                            <>
                                <Button
                                    aria-controls={`menu-${index}`}
                                    aria-haspopup="true"
                                    onClick={(event) => handleClick(event, index)}
                                    sx={{ color: '#fff' }}
                                >
                                    {item.main}
                                </Button>

                                <Menu
                                    id={`menu-${index}`}
                                    anchorEl={anchorEl[index]}
                                    open={Boolean(anchorEl[index])}
                                    onClick={(event) => handleClose(event, index)}
                                >
                                    {item.sub.map((subItem, subIndex) => (
                                        <MenuItem key={subIndex} onClick={() => handleClose(index)}>
                                            <Link to={subItem.path}>{subItem.pathName}</Link>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </>
                        )
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </div >
       
    )
}

export default Header