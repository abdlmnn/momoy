import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const StyleSignup = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topButton: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  botButton: {
    padding: 20,
  },
  topShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.gray,
    opacity: 0.2,
  },
  continueButton: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 12,
    borderRadius: 7,
  },
  continueText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  colorIcon: {
    color: Colors.charcoal,
    fontSize: 24,
    fontWeight: '600',
  },
  midContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 15,
  },
  midContent2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 23,
    paddingHorizontal: 20,
  },
  logo: {
    height: 55,
    width: 55,
    borderRadius: 12,
    marginLeft: 10,
  },
  logo2: {
    height: 75,
    width: 75,
    borderRadius: 15,
  },
  h1: {
    fontWeight: '900',
    fontSize: 28,
    color: Colors.charcoal,
  },
  h2: {
    fontWeight: '700',
    fontSize: 20,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  p: {
    fontSize: 14,
    color: Colors.charcoal,
  },
  pGrey: {
    textAlign: 'center',
    fontSize: 14,
    color: Colors.mediumGray,
  },

  inputContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
    position: 'relative',
  },
  input: {
    color: Colors.charcoal,
  },

  checkInboxButton: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 12,
    borderRadius: 7,
    marginBottom: 12,
  },
  buttonPressed: {
    backgroundColor: Colors.lightTangerine,
  },

  resendLinkButton: {
    paddingVertical: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.charcoal,
  },
  sendText: {
    color: Colors.charcoal,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonPressed2: {
    backgroundColor: Colors.light,
  },
});
