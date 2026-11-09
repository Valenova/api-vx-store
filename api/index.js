// 📸 INSTAGRAM
else if (cmd === 'ig' || cmd === 'igdl') {
  if (!args) return bot.sendMessage(pengirim, { text: '⚠️ Masukkan link Instagram!' });
  
  await bot.sendMessage(pengirim, { text: '⏳ Sedang diproses...' });
  try {
    const res = await axios.get(`${config.apiUrl}/api/igdl?url=${encodeURIComponent(args)}`);
    if (res.data.status && res.data.result) {
      await bot.sendMessage(pengirim, { 
        video: { url: res.data.result },
        caption: '✅ Berhasil! 📸'
      });
    } else {
      await bot.sendMessage(pengirim, { text: `❌ ${res.data.message || 'Gagal, coba link lain ya~'}` });
    }
  } catch (e) {
    await bot.sendMessage(pengirim, { text: '❌ Error, coba lagi nanti ya' });
  }
}
