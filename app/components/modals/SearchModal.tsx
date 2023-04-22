'use client';

import useSearchModal from '@/app/hooks/useSearchModal';
import { formatISO } from 'date-fns/esm';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { useCallback, useMemo, useState } from 'react';
import { Range } from 'react-date-range';
import Heading from '../Heading';
import Calendar from '../inputs/Calendar';
import Counter from '../inputs/Counter';
import CountrySelect, { CountrySelectValue } from '../inputs/CountrySelect';
import Modal from './Modal';

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}
const SearchModal = () => {
  const router = useRouter();
  const params = useSearchParams();
  const searchModal = useSearchModal();
  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setSteps] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const Map = useMemo(
    () =>
      dynamic(() => import('../Map'), {
        ssr: false,
      }),
    [location]
  );

  const onBack = useCallback(() => {
    setSteps((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setSteps((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = queryString.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = queryString.stringifyUrl(
      {
        url: '/',
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setSteps(STEPS.LOCATION);
    searchModal.onClose();

    router.push(url);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    bathroomCount,
    dateRange,
    onNext,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search';
    }

    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Where do you wanna go?"
        subtitle="Find the perfectd location!"
      ></Heading>
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      ></CountrySelect>

      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you paln to go?"
          subtitle="Make sure everyone is free!"
        ></Heading>

        <Calendar
          value={dateRange}
          onChange={(value) => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        '
        <Heading
          title="More infomration"
          subtitle="Find your perfect place!"
        ></Heading>
        <Counter
          title="Guests"
          subtitle="How many guests are coming?"
          value={guestCount}
          onChange={(value) => setGuestCount(value)}
        ></Counter>
        <Counter
          title="Rooms"
          subtitle="How many rooms do you need?"
          value={roomCount}
          onChange={(value) => setRoomCount(value)}
        ></Counter>
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
          value={bathroomCount}
          onChange={(value) => setBathroomCount(value)}
        ></Counter>
      </div>
    );
  }
  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={onSubmit}
      title="Filters"
      actionLabel={actionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      secondaryActionLabel={secondaryActionLabel}
      body={bodyContent}
    ></Modal>
  );
};

export default SearchModal;
