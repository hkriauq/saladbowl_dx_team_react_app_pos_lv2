import React,  { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';



function Header({ isLoggedIn , setIsLoggedIn , cartItemCount ,usrName }) {
  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/login');
  };
  const handleCartClick = () => {
    navigate('/cart'); 
  };


  return (
    <Box className="header-switch-label" sx={{ flexGrow: 1 }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={auth ? 'Logout' : 'Login'}
        />
      </FormGroup>

      <AppBar className="header-icon-button" position="fixed" sx={{ backgroundColor: '#17594A' }}>
        <Toolbar>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ 
              width: '20px',
              height: '20px',
              padding: '2px',
              marginLeft: '5px'
            }}
            className="header-icon-button" 
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}  style={{ fontFamily: '"Helvetica", sans-serif',fontSize: '14pt',fontWeight: 'bold'}}>
           <div>SALADBOWL App</div>
          </Typography>

          <div className="Login_username" style={{ display: 'flex', alignItems: 'center', fontSize: '11pt', fontWeight: 'bold', padding : '20px' }}>
             {isLoggedIn ? (
                <div>Hello! {usrName}  さん</div>
               ) : (
                <div>Hello! ゲストさん</div>
               )}
            </div>

          {auth && (
            <div className="header-icon-button"  style={{ display: 'flex', alignItems: 'center'}}>
              <IconButton
                size="small"
                color="inherit"
                aria-label="shopping cart"
                sx={{ 
                  width: '50px',
                  height: '50px',
                  padding: '2px',
                  marginLeft: '5px'
                }}
                className="header-icon-button" 
                onClick={handleCartClick} 
              >
                <Badge color="secondary" badgeContent={cartItemCount}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ 
                  width: '50px',
                  height: '50px',
                  padding: '2px',
                  marginLeft: '5px'
                }}
                className="header-icon-button" 
              >
                <AccountCircle />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => navigate('/login')}>ログイン</MenuItem>
                {isLoggedIn && <MenuItem onClick={handleLogout}>ログアウト</MenuItem>}
              </Menu>

            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
