export const navigation = [
	{ label: 'Anasayfa', href: '/' },
	{
		label: 'Kategoriler',
		href: '#hizmetler',
		children: [
			{ label: 'Gebelik & Doğum', href: '/category/gebelik-dogum/' },
			{ label: 'Jinekoloji & Kadın Sağlığı', href: '/category/jinekoloji/' },
			{ label: 'Tüp Bebek & İnfertilite', href: '/category/tup-bebek-infertilite/' },
			{ label: 'Cerrahi İşlemler', href: '/category/cerrahi-islemler/' },
			{ label: 'Estetik Jinekoloji', href: '/category/estetik-jinekoloji/' },
		],
	},
	{
		label: 'Hasta Bilgilendirme',
		href: '/hasta-bilgilendirme/',
		children: [
			{ label: 'Hafta Hafta Gebelik', href: '/hafta-hafta-gebelik/' },

			{ label: 'Online Randevu', href: '/online-randevu/' },
		],
	},
	{ label: 'Dr. Alper Mumcu', href: '/dr-alper-mumcu/' },
	{ label: 'Makale Arşivi', href: '/blog/' },
	{ label: 'İletişim', href: '/iletisim/' },
];
