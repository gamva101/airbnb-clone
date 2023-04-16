'use client';

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { SafeUser } from '../types';

interface HeardButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}
const HeardButton: React.FC<HeardButtonProps> = ({
  listingId,
  currentUser,
}) => {
  const hasFavorited = false;
  const toggleFavorite = () => {};

  return (
    <div
      onClick={toggleFavorite}
      className="relative cursor-pointer transition hover:opacity-80"
    >
      <AiOutlineHeart
        size={28}
        className="absolute -right-[2px] -top-[2px] fill-white"
      />
      <AiFillHeart
        size={28}
        className={hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'}
      />
    </div>
  );
};

export default HeardButton;
