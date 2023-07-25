import * as React from 'react';
import { AVATARS } from '../../constants/avatar';
import { AvatarURLS } from '../../constants/avatar';
import { AvatarWrapper, SelectionRow } from './AvatarSelection.styles';
import { Typography } from '@mui/material';
import { useRef } from 'react';

export const AvatarSelection = ({ avatar, setAvatar }: { avatar: AVATARS; setAvatar: React.Dispatch<AVATARS> }) => {
  const AvatarThumbnail: React.FC<{ avatar: AVATARS }> = ({ avatar }) => {
    const imageRef = useRef(AvatarURLS[avatar]);
    return <img onClick={() => setAvatar(avatar)} src={imageRef.current} width={80} height={80} />;
  };

  return (
    <>
      <Typography variant={'h6'} color={'primary.dark'}>
        Select an avatar
      </Typography>
      <SelectionRow>
        <AvatarWrapper isSelected={avatar === AVATARS.benjamin}>
          <AvatarThumbnail avatar={AVATARS.benjamin} />
        </AvatarWrapper>
        <AvatarWrapper isSelected={avatar === AVATARS.caticorn}>
          <AvatarThumbnail avatar={AVATARS.caticorn} />
        </AvatarWrapper>
        <AvatarWrapper isSelected={avatar === AVATARS.meredith}>
          <AvatarThumbnail avatar={AVATARS.meredith} />
        </AvatarWrapper>
        <AvatarWrapper isSelected={avatar === AVATARS.olivia}>
          <AvatarThumbnail avatar={AVATARS.olivia} />
        </AvatarWrapper>
      </SelectionRow>
    </>
  );
};
