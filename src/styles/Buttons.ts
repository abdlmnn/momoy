import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const signupStyles = StyleSheet.create({
  signUpButton: {
    borderWidth: 1,
    borderColor: Colors.gray,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: Colors.light,
  },
  buttonText: {
    color: Colors.mediumGray,
    fontSize: 14,
    fontWeight: '700',
  },
});

export const loginStyles = StyleSheet.create({
  loginButton: {
    backgroundColor: Colors.darkTangerine,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: Colors.lightTangerine,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});

export const guestStyles = StyleSheet.create({
  guestButton: {
    borderWidth: 1,
    borderColor: Colors.charcoal,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestText: {},
  buttonPressed: {
    backgroundColor: Colors.light,
  },
  buttonText: {
    color: Colors.charcoal,
    fontSize: 14,
    fontWeight: '700',
  },
});
