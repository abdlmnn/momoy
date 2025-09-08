import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

export const StyleWelcome = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightTangerine,
  },

  closeButton: {
    position: 'absolute',
    top: 2,
    left: 10,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: 'bold',
  },

  topSection: {
    flex: 1.05,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  image: {
    height: width * 0.7,
    width: height * 0.5,
  },

  bottomSection: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  textSection: {
    gap: 5,
  },

  topBold: {
    fontWeight: '800',
    fontSize: 18,
    fontFamily: 'Poppins',
    color: Colors.charcoal,
  },

  pText: {
    fontSize: 12,
    color: Colors.charcoal,
  },

  buttonSection: {
    flex: 1,
    gap: 15,
    justifyContent: 'flex-end',
  },

  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light,
  },
  text: {
    marginHorizontal: 10,
    color: Colors.mediumGray,
    opacity: 0.4,
    fontSize: 14,
    fontWeight: '600',
  },

  policyText: {
    color: Colors.charcoal,
  },
  underlineText: {
    textDecorationLine: 'underline',
    color: Colors.charcoal,
    fontWeight: '600',
  },
});
