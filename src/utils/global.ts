import { Dimensions } from 'react-native';

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
const dimen = {
  small_padding: 10,
  app_padding: 15,
  login_border_radius: 5,
  signup_margin: 27,
  buttonfont: 15,
  textinputfontsize: 14, //50
  home_item_padding: 5,

  bottom_user_padding: 30,
  bottom_margin_for_bottom_menu: 66,
  bottom_tab_height: 56,
  border_radius: 10,

  carouselContainerWidth: deviceWidth,
  login_input_padding: 5,
  login_input_font_size: 14,
};

export const dime = {
  lPadding: 20,
  nPadding: 15,
  sPadding: 10,
  eSPadding: 5,

  nBorderRadius: 10,
};

export const textSize = {
  h1: 20,
  h12: 18,
  h2: 16,
  h3: 14,
  h4: 13,
  h5: 12,
  h6: 10,

  nBorderRadius: 10,
};

export default dimen;
