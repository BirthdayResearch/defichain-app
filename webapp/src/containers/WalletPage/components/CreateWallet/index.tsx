import React, { useEffect, useState } from 'react';
import { getMnemonic } from '../../service';
import CreateNewWallet from './CreateNewWallet';
import VerifyMnemonic from './VerifyMnemonic';
import { getMixWords, getRandomWords } from '../../service';
import { RouteComponentProps } from 'react-router-dom';

interface CreateWalletProps extends RouteComponentProps {}

const CreateWallet: React.FunctionComponent<CreateWalletProps> = (
  props: CreateWalletProps
) => {
  const { history } = props;

  const [mnemonicObj, setMnemonicObj] = useState({});
  const [mnemonicCode, setMnemonicCode] = useState('');
  const [isWalletTabActive, setIsWalletTabActive] = useState(false);

  const randomWordObj = getRandomWords();
  const finalMixObj = getMixWords(mnemonicObj, randomWordObj);

  useEffect(() => {
    generateNewMnemonic();
  }, []);

  const generateNewMnemonic = () => {
    const { mnemonicCode, mnemonicObj } = getMnemonic();
    setMnemonicObj(mnemonicObj);
    setMnemonicCode(mnemonicCode);
  };

  return (
    <div className='main-wrapper'>
      {!isWalletTabActive ? (
        <CreateNewWallet
          mnemonicObj={mnemonicObj}
          generateNewMnemonic={generateNewMnemonic}
          isWalletTabActive={isWalletTabActive}
          setIsWalletTabActive={setIsWalletTabActive}
        />
      ) : (
        <VerifyMnemonic
          mnemonicObj={mnemonicObj}
          finalMixObj={finalMixObj}
          mnemonicCode={mnemonicCode}
          history={history}
          isWalletTabActive={isWalletTabActive}
          setIsWalletTabActive={setIsWalletTabActive}
        />
      )}
    </div>
  );
};

export default CreateWallet;
