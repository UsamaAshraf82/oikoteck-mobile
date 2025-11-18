import { WarningIcon } from 'phosphor-react-native';
import React, { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { uid } from 'uid';
import { create } from 'zustand';
import AppText from '~/components/Elements/AppText';
import Grid from '~/components/HOC/Grid';
import { cn } from '~/lib/utils';
import tailwind from '~/utils/tailwind';

type State = {
  state: Map<string, ReactNode>;
};

type Actions = {
  confirmPopup: (data: {
    className?: string;
    label: ReactNode;
    message: ReactNode;
    notice?: { label: ReactNode; message: ReactNode };
    confirm?: { text?: ReactNode; className?: string; textClassName?: string };
    discard?: { text?: ReactNode; className?: string; textClassName?: string };
    onConfirm: () => void;
    onDiscard?: () => void;
  }) => void;
};

const usePopup = create<State & Actions>((set) => ({
  state: new Map(),

  confirmPopup: ({ label, message, notice, className, onConfirm, onDiscard, confirm, discard }) => {
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
        <View className="gap-1 rounded-[20px] bg-white px-4 py-4">
          <View className="self-center rounded-full bg-red-600/20 p-4">
            <WarningIcon color={tailwind.theme.colors.red[600]} weight="fill" size={32} />
          </View>
          {typeof label === 'string' ? (
            <AppText className="text-center font-bold text-xl text-primary">{label}</AppText>
          ) : React.isValidElement(label) ? (
            label
          ) : null}
          {typeof message === 'string' ? (
            <AppText className="text-center text-sm  text-[#5E5E6E]">{message}</AppText>
          ) : React.isValidElement(message) ? (
            message
          ) : null}
          {notice && (
            <View className='bg-yellow-50 px-3 py-2 rounded-lg'>
              {typeof notice.label === 'string' ? (
                <AppText className=" font-bold text-xl text-primary">
                  {notice.label}
                </AppText>
              ) : React.isValidElement(notice.label) ? (
                notice.label
              ) : null}
              {typeof notice.message === 'string' ? (
                <AppText className="text-sm  text-[#5E5E6E]">{notice.message}</AppText>
              ) : React.isValidElement(notice.message) ? (
                notice.message
              ) : null}
            </View>
          )}

          <Grid className="mt-1 px-4">
            <Pressable
              onPress={() => {
                onDiscard?.();
                set((state) => {
                  const map = state.state;
                  map.delete(i);
                  return { state: map };
                });
              }}
              className={cn('rounded-full border border-primary py-3', discard?.className)}>
              <AppText className={cn('text-center font-bold', discard?.textClassName)}>
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
              className={cn('rounded-full border border-primary py-3', confirm?.className)}>
              <AppText className={cn('text-center  font-bold', confirm?.textClassName)}>
                {confirm?.text ?? 'Confirm'}
              </AppText>
            </Pressable>
          </Grid>
          {/* {value.modal} */}
        </View>
      </Modal>

      // <AppText>ADA</AppText>
      // <ModalHOC
      //   key={i}
      //   header={''}
      //   className={cn('max-w-md bg-white p-4', className)}
      //   onClose={() => {
      //     onDiscard?.();
      //     set((state) => {
      //       const map = state.state;
      //       map.delete(i);
      //       return { state: map };
      //     });
      //   }}
      // >
      //   <div className='flex flex-col gap-2'>
      //     <div className='text-lg font-bold text-[#2F2F37]'>{label}</div>
      //     <div className='text-gray-2'>{message}</div>
      //     {notice && (
      //       <div className="relative bg-[#FCF1E9] p-2 content-[''] before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:bg-[#FA703F]">
      //         <div className='ml-2'>
      //           <div className='flex items-center gap-1 text-[#771505]'>
      //             <svg
      //               width='14'
      //               height='14'
      //               viewBox='0 0 14 14'
      //               fill='none'
      //               xmlns='http://www.w3.org/2000/svg'
      //             >
      //               <path
      //                 d='M7 0.5C5.71442 0.5 4.45772 0.881218 3.3888 1.59545C2.31988 2.30968 1.48676 3.32484 0.994786 4.51256C0.502816 5.70028 0.374095 7.00721 0.624899 8.26809C0.875703 9.52896 1.49477 10.6872 2.40381 11.5962C3.31285 12.5052 4.47104 13.1243 5.73192 13.3751C6.99279 13.6259 8.29973 13.4972 9.48744 13.0052C10.6752 12.5132 11.6903 11.6801 12.4046 10.6112C13.1188 9.54229 13.5 8.28558 13.5 7C13.4982 5.27665 12.8128 3.62441 11.5942 2.40582C10.3756 1.18722 8.72335 0.50182 7 0.5ZM7 12.5C5.91221 12.5 4.84884 12.1774 3.94437 11.5731C3.0399 10.9687 2.33495 10.1098 1.91867 9.10476C1.50238 8.09977 1.39347 6.9939 1.60568 5.927C1.8179 4.86011 2.34173 3.8801 3.11092 3.11091C3.8801 2.34172 4.86011 1.8179 5.92701 1.60568C6.9939 1.39346 8.09977 1.50238 9.10476 1.91866C10.1098 2.33494 10.9687 3.03989 11.5731 3.94436C12.1774 4.84883 12.5 5.9122 12.5 7C12.4983 8.45818 11.9184 9.85617 10.8873 10.8873C9.85617 11.9184 8.45819 12.4983 7 12.5ZM8 10C8 10.1326 7.94732 10.2598 7.85356 10.3536C7.75979 10.4473 7.63261 10.5 7.5 10.5C7.23479 10.5 6.98043 10.3946 6.7929 10.2071C6.60536 10.0196 6.5 9.76522 6.5 9.5V7C6.36739 7 6.24022 6.94732 6.14645 6.85355C6.05268 6.75979 6 6.63261 6 6.5C6 6.36739 6.05268 6.24021 6.14645 6.14645C6.24022 6.05268 6.36739 6 6.5 6C6.76522 6 7.01957 6.10536 7.20711 6.29289C7.39465 6.48043 7.5 6.73478 7.5 7V9.5C7.63261 9.5 7.75979 9.55268 7.85356 9.64645C7.94732 9.74021 8 9.86739 8 10ZM6 4.25C6 4.10166 6.04399 3.95666 6.1264 3.83332C6.20881 3.70999 6.32595 3.61386 6.46299 3.55709C6.60003 3.50032 6.75083 3.48547 6.89632 3.51441C7.04181 3.54335 7.17544 3.61478 7.28033 3.71967C7.38522 3.82456 7.45665 3.9582 7.48559 4.10368C7.51453 4.24917 7.49968 4.39997 7.44291 4.53701C7.38615 4.67406 7.29002 4.79119 7.16668 4.8736C7.04334 4.95601 6.89834 5 6.75 5C6.55109 5 6.36032 4.92098 6.21967 4.78033C6.07902 4.63968 6 4.44891 6 4.25Z'
      //                 fill='currentColor'
      //               />
      //             </svg>
      //             {notice.label}
      //           </div>
      //           <div className='ml-1 text-[#BC4C2E]'>{notice.message}</div>
      //         </div>
      //       </div>
      //     )}
      //     <div className='flex items-center justify-end gap-3'>
      //       <button
      //         className={cn(
      //           'border-primary text-primary rounded-full border px-5 py-2',
      //           discard?.className
      //         )}
      //         onClick={() => {
      //           onDiscard?.();
      //           set((state) => {
      //             const map = state.state;
      //             map.delete(i);
      //             return { state: map };
      //           });
      //         }}
      //       >
      //         {discard?.text || 'No'}
      //       </button>
      //       <button
      //         className={cn(
      //           'rounded-full border border-red-700 bg-red-700 px-5 py-2 text-white',
      //           confirm?.className
      //         )}
      //         onClick={() => {
      //           onConfirm();
      //           set((state) => {
      //             const map = state.state;
      //             map.delete(i);
      //             return { state: map };
      //           });
      //         }}
      //       >
      //         {confirm?.text || 'Yes'}
      //       </button>
      //     </div>
      //   </div>
      // </ModalHOC>
    );


    set((state) => {
      const map = state.state;
      map.set(i, <Popup />);
      return { state: map };
    });
  },
}));

export default usePopup;
