export const navigation = [
	{ label: 'Anasayfa', href: '/' },
	{
		label: 'Hamilelik',
		href: '/hamilelik/',
		children: [
			{ label: 'Hamilelik genel bilgiler', href: '/hamilelik/' },
			{ label: 'Hafta Hafta Gebelik', href: '/category/hamilelik/hafta-hafta-gebelik/' },
			{ label: 'Hamilelik ve …', href: '/hamilelik-ve/' },
			{ label: 'Hamilelik ve Beslenme', href: '/hamilelik-ve-beslenme/' },
			{ label: 'Hamilelik ve Enfeksiyonlar', href: '/hamilelik-ve-enfeksiyonlar/' },
			{ label: 'Hamilelik ve Seyahat', href: '/hamilelik-ve-seyahat/' },
			{ label: 'Hamilelik ve Ultrason', href: '/hamilelik-ve-ultrason/' },
			{ label: 'Hamilelikte Merak Edilenler', href: '/hamilelikte-merak-edilenler/' },
			{ label: 'Riskli Gebelikler', href: '/riskli-gebelikler/' },
			{ label: 'Güncel Hamilelik Haberleri', href: '/category/hamilelik/hamilelik-haberleri/' },
		],
	},
	{ label: 'Doğum', href: '/dogum/' },
	{
		label: 'Jinekoloji',
		href: '/jinekoloji/',
		children: [
			{ label: 'Jinekoloji', href: '/jinekoloji/' },
			{ label: 'Cerrahi İşlemler', href: '/cerrahi-islemler/' },
			{ label: 'Doğum Kontrolü', href: '/dogum-kontrolu/' },
			{ label: 'HPV dosyası', href: '/hpv-dosyasi/' },
		],
	},
	{
		label: 'İnfertilite',
		href: '/infertilite/',
		children: [
			{ label: 'İnfertilite', href: '/infertilite/' },
			{ label: 'Kısırlık Tedavisi ve Tüp Bebek', href: '/kisirlik-tedavisi-ve-tup-bebek/' },
			{ label: 'Tüp Bebek | Haber', href: '/category/infertilite/tup-bebek-haber/' },
		],
	},
	{ label: 'Cinsel Yaşam', href: '/cinsel-yasam/' },
	{ label: 'Estetik', href: '/genital-estetik/' },
	{
		label: 'Blog',
		href: '/blog/',
		children: [
			{ label: 'Literatürden', href: '/category/literaturden/' },
			{ label: 'Genel Konular', href: '/category/genel-konular/' },
		],
	},
	{
		label: 'İletişim',
		href: '/iletisim/',
		children: [
			{ label: 'Dr. Alper Mumcu', href: '/dr-alper-mumcu/' },
			{ label: 'Online Randevu', href: '/online-randevu/' },
			{ label: 'Geri Bildirim Formu', href: '/geri-bildirim-formu/' },
		],
	},
];
