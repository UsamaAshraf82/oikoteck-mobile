import { WarningIcon } from 'phosphor-react-native';
import * as React from 'react';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { uid } from 'uid';
import { create } from 'zustand';
import AppText from '~/components/Elements/AppText';
import Grid from '~/components/HOC/Grid';

type State = {
  state: Map<string, ReactNode>;
};

type Actions = {
  confirmPopup: (data: {
    style?: any;
    label: ReactNode;
    message: ReactNode;
    notice?: { label: ReactNode; message: ReactNode };
    confirm?: { text?: ReactNode; style?: any; textStyle?: any };
    discard?: { text?: ReactNode; style?: any; textStyle?: any };
    onConfirm: () => void;
    onDiscard?: () => void;
  }) => void;
};

const usePopup = create<State & Actions>((set) => ({
  state: new Map(),

  confirmPopup: ({ label, message, notice, style, onConfirm, onDiscard, confirm, discard }) => {
    const i = uid();
    const Popup = () => (
      <Modal
        isVisible={true}
        // onBackdropPress={() => {
        //   onDiscard?.();
        //   set((state) => {
        //     const map = state.state;
        //     map.delete(i);
        //     return { state: map };
        //   });
        // }}
        // onSwipeComplete={() => {
        //   onDiscard?.();
        //   set((state) => {
        //     const map = state.state;
        //     map.delete(i);
        //     return { state: map };
        //   });
        // }}
        // swipeDirection="down"
        hardwareAccelerated
        avoidKeyboard={false}
        // style={{ justifyContent: 'flex-end', margin: 0 }}
        propagateSwipe>
        <View style={[styles.container, style]}>
          <View style={styles.warningWrapper}>
            <WarningIcon color="#dd2c2c" weight="fill" size={32} />
          </View>
          {typeof label === 'string' ? (
            <AppText style={styles.labelText}>{label}</AppText>
          ) : React.isValidElement(label) ? (
            label
          ) : null}
          {typeof message === 'string' ? (
            <AppText style={styles.messageText}>{message}</AppText>
          ) : React.isValidElement(message) ? (
            message
          ) : null}
          {notice && (
            <View style={styles.noticeWrapper}>
              {typeof notice.label === 'string' ? (
                <AppText style={styles.noticeLabel}>{notice.label}</AppText>
              ) : React.isValidElement(notice.label) ? (
                notice.label
              ) : null}
              {typeof notice.message === 'string' ? (
                <AppText style={styles.noticeMessage}>{notice.message}</AppText>
              ) : React.isValidElement(notice.message) ? (
                notice.message
              ) : null}
            </View>
          )}

          <Grid style={styles.grid}>
            <Pressable
              onPress={() => {
                onDiscard?.();
                set((state) => {
                  const map = state.state;
                  map.delete(i);
                  return { state: map };
                });
              }}
              style={[styles.button, styles.discardButton, discard?.style]}>
              <AppText style={[styles.buttonText, discard?.textStyle]}>
                {discard?.text ?? 'Cancel'}
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => {
                onConfirm?.();
                set((state) => {
                  const map = state.state;
                  map.delete(i);
                  return { state: map };
                });
              }}
              style={[styles.button, styles.confirmButton, confirm?.style]}>
              <AppText style={[styles.buttonText, styles.confirmText, confirm?.textStyle]}>
                {confirm?.text ?? 'Confirm'}
              </AppText>
            </Pressable>
          </Grid>
          {/* {value.modal} */}
        </View>
      </Modal>
    );

    set((state) => {
      const map = state.state;
      map.set(i, <Popup />);
      return { state: map };
    });
  },
}));

const styles = StyleSheet.create({
  container: {
    gap: 4,
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 16,
  },
  warningWrapper: {
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(221, 44, 44, 0.2)',
    padding: 16,
    marginBottom: 8,
  },
  labelText: {
    textAlign: 'center',
    fontFamily: 'LufgaBold',
    fontSize: 20,
    color: '#192234',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#5E5E6E',
    marginTop: 4,
  },
  noticeWrapper: {
    backgroundColor: '#FEFCE8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  noticeLabel: {
    fontFamily: 'LufgaBold',
    fontSize: 16,
    color: '#192234',
  },
  noticeMessage: {
    fontSize: 14,
    color: '#5E5E6E',
  },
  grid: {
    marginTop: 16,
  },
  button: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discardButton: {
    borderColor: '#192234',
    marginRight: 8,
  },
  confirmButton: {
    borderColor: '#82065e',
    backgroundColor: '#82065e',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'LufgaBold',
    fontSize: 16,
    color: '#192234',
  },
  confirmText: {
    color: 'white',
  },
});

export default usePopup;
