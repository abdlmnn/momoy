import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const StyleHome = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topBar: {
    backgroundColor: 'red',
    padding: 20,
  },
  searchContainer: {},
  search: {
    backgroundColor: 'gray',
    padding: 20,
  },
});
