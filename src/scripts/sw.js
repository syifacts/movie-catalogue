import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, Route } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
 
// Do precaching
precacheAndRoute(self.__WB_MANIFEST);
 
const themoviedbApi = new Route(
  ({ url }) => url.href.startsWith('https://api.themoviedb.org/3/'),
  new StaleWhileRevalidate({
    cacheName: 'themoviedb-api',
  }),
);
 
const themoviedbImageApi = new Route(
  ({ url }) => url.href.startsWith('https://image.tmdb.org/t/p/w500/'),
  new StaleWhileRevalidate({
    cacheName: 'themoviedb-image-api',
  }),
);
 
registerRoute(themoviedbApi);
registerRoute(themoviedbImageApi);
 
self.addEventListener('install', () => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});
 
self.addEventListener('push', (event) => {
  console.log('Service Worker: Pushed');
 
  const dataJson = event.data.json();
  const notification = {
    title: dataJson.title,
    options: {
      body: dataJson.options.body,
      icon: dataJson.options.icon,
      image: dataJson.options.image,
    },
  };
  self.addEventListener('notificationclick', (event) => {
    const clickedNotification = event.notification;
    clickedNotification.close();
    const chainPromise = async () => {
      console.log('Notification has been clicked');
      await self.clients.openWindow('https://www.dicoding.com/');
    };
 
  event.waitUntil(self.registration.showNotification(notification.title, notification.options));
  
  event.waitUntil(chainPromise());
});
});