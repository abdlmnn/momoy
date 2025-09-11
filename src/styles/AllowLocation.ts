import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../constants/Colors';

export const StyleAllowLocation = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  upChild: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downChild: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 18,
    color: Colors.charcoal,
    fontWeight: '700',
    marginBottom: 5,
  },
  benefitContainer: {
    flex: 1,
    gap: 15,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imageLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.mediumGray,
  },
  button: {
    backgroundColor: Colors.darkTangerine,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 7,
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
