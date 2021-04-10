import React, { useEffect, useState } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from 'reactstrap';
import RenameModel from '../RenameModel';

interface WalletActionDropdownProps {
  renameModalOpen: boolean;
  handleRenameButtonClick: () => void;
}

const WalletActionDropdown: React.FunctionComponent<WalletActionDropdownProps> = (
  props: WalletActionDropdownProps
) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [modal, setModal] = useState(true);
  const { renameModalOpen, handleRenameButtonClick } = props;

  const toggles = () => {
    const isOpen = !renameModalOpen;
    setModal(!isOpen);
    handleRenameButtonClick();
  };

  return (
    <>
      <Dropdown direction='left' isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          tag='span'
          data-toggle='dropdown'
          aria-expanded={dropdownOpen}
        >
          <MdMoreHoriz />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            {I18n.t('containers.wallet.walletPage.backup')}
          </DropdownItem>
          <DropdownItem onClick={toggles}>
            {I18n.t('containers.wallet.walletPage.rename')}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <RenameModel toggles={toggles} renameModalOpen={renameModalOpen} />
    </>
  );
};

export default WalletActionDropdown;
