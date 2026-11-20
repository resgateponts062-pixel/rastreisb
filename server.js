const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASS || 'rota2026';
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dados iniciais padrão
const DEFAULT_DATA = {
  code: 'RTX-2026062-001',
  driverCode: 'LIB-RTX-2026062-001',
  date: 'Hoje, 20/11/2026',
  time: '14:00 às 17:30',
  region: 'Rota Express · Unidade Destino',
  steps: [
    {
      state: 'done',
      title: 'Pedido faturado e registrado na base',
      desc: 'Protocolo vinculado com pagamento exclusivo no ato da entrega.',
      time: '18/11 · 09:14'
    },
    {
      state: 'done',
      title: 'Transferência concluída entre terminais',
      desc: 'Carga conferida e liberada pela central logística.',
      time: '19/11 · 22:40'
    },
    {
      state: 'now',
      title: 'Em rota de entrega para o endereço',
      desc: 'Veículo da frota em deslocamento. Aguardando validação digital.',
      time: 'Hoje · 08:15'
    },
    {
      state: 'pending',
      title: 'Entrega e leitura do QR Code',
      desc: 'Entregador envia o QR Code mediante código de liberação; pagamento no ato.',
      time: 'Previsto 14:00 - 17:30'
    }
  ]
};

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
      return DEFAULT_DATA;
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (err) {
    return DEFAULT_DATA;
  }
}

function writeData(newData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2), 'utf-8');
}

// Inicializa arquivo se não existir
readData();

// API Pública: Consulta o rastreio atual
app.get('/api/tracking', (req, res) => {
  const data = readData();
  res.json(data);
});

// API Admin: Atualiza código, data, horário, região e etapas
app.post('/api/admin/update', (req, res) => {
  const password = req.headers['x-admin-pass'];
  if (password !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Senha administrativa incorreta.' });
  }

  const { code, driverCode, date, time, region, steps } = req.body;
  if (!code || !date || !time || !Array.isArray(steps)) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  const cleanCode = String(code).trim().toUpperCase();
  const cleanDriverCode = driverCode && String(driverCode).trim()
    ? String(driverCode).trim().toUpperCase()
    : `LIB-${cleanCode}`;

  const updated = {
    code: cleanCode,
    driverCode: cleanDriverCode,
    date: String(date).trim(),
    time: String(time).trim(),
    region: String(region || 'Rota Express · Unidade Destino').trim(),
    steps: steps.map(s => ({
      state: ['done', 'now', 'pending'].includes(s.state) ? s.state : 'pending',
      title: String(s.title || '').trim(),
      desc: String(s.desc || '').trim(),
      time: String(s.time || '').trim()
    }))
  };

  writeData(updated);
  res.json({ ok: true, data: updated });
});

// Rota amigável para o painel admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Rota Express rodando na porta ${PORT}`);
});
