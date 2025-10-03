import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const StyleHome = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightTangerine,
  },
  topBar: {
    backgroundColor: Colors.lightTangerine,
    // borderWidth: 1,
    // flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 13,
    marginBottom: 5,
  },
  upRow: { flexDirection: 'row', gap: 15 },

  mapPinRow: {
    // borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addressWrapper: {
    // borderWidth: 1,
    flexShrink: 1,
    flex: 1,
  },
  addressText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 700,
  },
  cityText: {
    color: Colors.white,
    fontSize: 12,
  },

  iconRow: {
    // borderWidth: 1,
    // flex: 1,
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
  },
  icons: {
    // borderWidth: 1,
    padding: 7,
  },

  bottomRow: {
    // borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 10,
    // marginBottom: 5,
  },
  searchInput: {
    // borderWidth: 1,
    flex: 1,
    fontSize: 14,
    color: Colors.grayBar2,
    fontWeight: 500,
  },

  botBar: {
    // borderWidth: 1,
    backgroundColor: Colors.white,
    flex: 1,
    // flexDirection: 'row',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    // gap: 10,
  },

  categoryRow: {
    // paddingHorizontal: 10,
    // gap: 10,
    borderWidth: 1,
  },
  categoryItem: {
    // borderWidth: 1,
    // borderRadius: 25,
    borderRadius: 8,
    marginRight: 10,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginBottom: 12,
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },

  fakeImage: {
    width: 100,
    height: 100,
    backgroundColor: Colors.grayBar,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },

  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.charcoal,
  },

  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  newTag: {
    backgroundColor: Colors.lightTangerine,
    color: Colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },

  addToCartBtn: {
    marginTop: 8,
    backgroundColor: Colors.lightTangerine,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },

  addToCartText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
