import { Icon } from '@lib/images';
import { ImageSVG } from '@lib/images/ImageSVG';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="flex h-full  w-full flex-col items-center justify-center">
      <div
        className="bg-background"
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          bottom: '0',
          right: '0',
          opacity: '0.2',
        }}
      >
        <ImageSVG src="../../images/kaleidoscope-backdrop.svg" size="100vmax" />
      </div>
      <div
        className="flex flex-col items-center"
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          bottom: '0',
          right: '0',
        }}
      >
        <div className="flex flex-col items-center pb-6">
          <Icon size="12rem" src="../../images/inventory.svg" />
          <p className="text-xl font-medium">Inventory</p>
          <p className="text-small text-default-500">
            Log in to your account to continue
          </p>
        </div>
        <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
