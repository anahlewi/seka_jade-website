
import { Component } from 'react';
import { Grid, Typography, Button, Badge, Tooltip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ModalComponent from './components/ModalComponent';
import './App.css';
import { homePageImageMetaData } from './assets/images/homePageImageMeta';
import homePageTitleImg from './assets/homepageTitle.png';

const StyledBadge = styled(Badge)`
     & .MuiBadge-badge {
       background-color: #2C3607;
       color: white;
       font-family: 'Sekasfont-Regular';
       font-size: 1em;
     }
   `;
class HomePage extends Component {
  constructor(props) {
    super(props);
    // Check if the user is a wedding guest
    if (localStorage.getItem('isWeddingGuest') !== 'true') {
      window.location.href = '/';
      return;
    }
    this.state = {
      isModalOpen: false,
      selectedImage: null, // To store the image that is clicke
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(img) {
    this.setState({ isModalOpen: true, selectedImage:img});
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }



  render() {
    // Helper to render images by section and row
    const renderImages = (section, row) =>
      homePageImageMetaData
        .filter((img) => img.position.section === section && img.position.grid.row === row)
        .map((img) => {
          const commonProps = {
            key: img.name,
            alt: img.alt,
            className: 'draggable image-context',
            style: { width: img.width, height: img.height },
          };
          if (img.motion) {
            return (
              <Grid item marginBottom={3} margin={1} key={img.name}>
                <StyledBadge
                  badgeInset="14%"
                  badgeContent={img.key}
                  anchorOrigin={{ vertical:`${img.vertical}`, horizontal:`${img.horizontal}`}}
                >
                  <Tooltip marginRight={1} title={img.name} placement='top'>
                    <motion.img
                      src={img.src}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={img.onClick? img.onClick : this.openModal.bind(this, img)}
                      transition={{ duration: img.transitionDuration || 2 }}
                      {...commonProps}
                    />
                  </Tooltip>
                </StyledBadge>
              </Grid>
            );
          }
          return (
            <Grid item marginBottom={3} key={img.name}>
              <StyledBadge
                badgeContent={img.key}
                color="primary"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeInset="14%"

              >
                <Tooltip title={img.name} placement='top'>
                  <img src={img.src} onClick={img.onClick? img.onClick : this.openModal.bind(this, img)} alt={img.alt || ''} {...commonProps} />
                </Tooltip>
              </StyledBadge>
            </Grid>
          );
        });

    const navItems = homePageImageMetaData.map(item => item.name);

    return (
      <div>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="fullpage-container"
          style={{ minHeight: '100vh', minWidth: '100vw', overflow: 'hidden' }}
        >
          <Grid container direction="row" justifyContent="center" alignItems="center" marginBottom={4} marginTop={-2}>
            <img src={homePageTitleImg} style={{width:330, height:100}} alt="Home Page Title"/>
          </Grid>
          {/* Top images row */}
          <Grid container direction="row" justifyContent="center" marginTop={-2} spacing={1}>
            {renderImages('top', 1)}
          </Grid>

          {/* middle images row */}
          <Grid container direction="row" justifyContent="center" marginTop={-1} spacing={1}>
            {renderImages('middle', 2)}
          </Grid>

          {/* Bottom images row */}
          <Grid container direction="row" justifyContent="center" marginTop={-1} spacing={1}>
            {renderImages('bottom', 3)}
          </Grid>

          {/* Footer */}
            <Button
                justifyContent="center"
                onClick={this.openModal}
                sx={{
                  fontFamily: 'Sekasfont-Regular',
                  fontSize: 18,
                  backgroundColor: '#2C3607',
                  color: 'white',
                  width: 300,
                  height: 35,
                  borderRadius: 2,
                  mt: -1
                }}
            >
              RSVP
            </Button>
            <ol className='nav-inline-list'>
              {navItems.map((item, index) => [
                <li key={item}>{item}</li>,
                index % 2 ? <br key="break" /> : null
              ])}
            </ol>
        </Grid>

        {this.state.isModalOpen && (
          <ModalComponent open={this.state.isModalOpen} onClose={this.closeModal}>
              <Typography sx={{fontFamily:'Sekasfont-Regular'}} variant="h2" marginTop={4} marginBottom={5} gutterBottom>
                {this.state.selectedImage.modalContent?.title || 'Modal Title'}
              </Typography>
              <Box marginTop={4} marginBottom={2}>
                {this.state.selectedImage.modalContent?.description || 'No description available.'}
              </Box>
          </ModalComponent>
        )}
      </div>
    );
  }
}


export default HomePage;
