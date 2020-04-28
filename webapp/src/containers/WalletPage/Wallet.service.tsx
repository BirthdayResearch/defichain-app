export const handelFetchMasterNodes = () => {
  const data = {
    requests: [
      {
        id: 0,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 1,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 2,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 3,
        type: "Sent",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 4,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 5,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 6,
        type: "Sent",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
      {
        id: 7,
        type: "Received",
        time: "Feb 19, 2:03 pm",
        hash: "c9a59be5d9f453229f519ab3c5289c",
        amount: 100,
        unit: "DFI",
      },
    ],
  };
  return data;
};

export const handelFetchWalletTxns = () => {
  const data = {
    walletTxns: [
      {
        id: 0,
        time: "Feb 19, 2:03 pm",
        amount: 0.123,
        message: "I need money!",
        unit: "DFI",
      },
      {
        id: 1,
        time: "Feb 19, 2:03 pm",
        amount: 0.123,
        message: "I need money!",
        unit: "DFI",
      },
    ],
  };
  return data;
};

export const handelReceivedData = () => {
  const data = {
    amountToReceive: "",
    amountToReceiveDisplayed: 0,
    receiveMessage: "",
    showBackdrop: "",
    receiveStep: "default",
  };
  return data;
};

export const handelSendData = () => {
  const data = {
    walletBalance: 100,
    amountToSend: "",
    amountToSendDisplayed: 0,
    toAddress: "",
    scannerOpen: false,
    flashed: "",
    showBackdrop: "",
    sendStep: "default",
    waitToSend: 5,
  };
  return data;
};
