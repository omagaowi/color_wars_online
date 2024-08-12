import Ably from 'ably';


const ably = new Ably.Realtime({
  key: 'sSQ9Ow.SOCOdQ:qGtnr0lwx-mF_WXG1uBpyoJK5c0XPZkZva_FfYpcfYE',
  clientId: `omagaow${Date.now().toString().split('').splice(5, 5).join('')}`
});

ably.connection.once('connected', () => {
  console.log('Connected to Ably!');
});

export default ably;
