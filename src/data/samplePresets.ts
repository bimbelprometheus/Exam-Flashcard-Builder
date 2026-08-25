export interface PresetTopic {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  text: string;
}

export const SAMPLE_PRESETS: PresetTopic[] = [
  {
    id: 'biologi-fotosintesis',
    category: 'Biologi SMA',
    title: 'Fotosintesis & Reaksi Terang-Gelap',
    excerpt: 'Proses konversi energi cahaya menjadi energi kimia oleh klorofil.',
    text: `Fotosintesis adalah proses biokimia pembentukan zat makanan seperti karbohidrat yang dilakukan oleh tumbuhan berklorofil dengan menggunakan energi cahaya matahari. 

Proses fotosintesis terbagi menjadi dua tahap utama:
1. Reaksi Terang (Light-dependent reactions):
Berlangsung di membran tilakoid kloroplas. Reaksi ini memerlukan foton cahaya matahari dan air (H2O). Cahaya diserap oleh klorofil pada fotosistem II dan fotosistem I. Terjadi fotolisis air (pemecahan molekul H2O menjadi H+, elektron, dan O2). Produk akhir reaksi terang adalah ATP, NADPH, dan gas Oksigen (O2) yang dilepaskan ke atmosfer.

2. Reaksi Gelap / Siklus Calvin (Light-independent reactions):
Berlangsung di stroma kloroplas. Reaksi ini tidak memerlukan cahaya secara langsung, tetapi membutuhkan ATP dan NADPH hasil reaksi terang serta karbon dioksida (CO2) dari udara. Siklus Calvin terdiri dari 3 fase: Fiksasi karbon oleh enzim RuBisCO (mengikat CO2 ke RuBP), Reduksi (membentuk G3P / PGAL), dan Regenerasi RuBP. Produk akhirnya adalah glukosa / karbohidrat.

Faktor-faktor yang memengaruhi laju fotosintesis meliputi intensitas cahaya, konsentrasi CO2, suhu optimal enzim, ketersediaan air, dan kadar klorofil.`
  },
  {
    id: 'sejarah-proklamasi',
    category: 'Sejarah Indonesia',
    title: 'Peristiwa Rengasdengklok & Proklamasi 1945',
    excerpt: 'Dinamika pergerakan pemuda dan proklamasi kemerdekaan Republik Indonesia.',
    text: `Peristiwa Proklamasi Kemerdekaan Indonesia pada 17 Agustus 1945 didahului oleh serangkaian dinamika penting antara golongan muda dan golongan tua.

Setelah Jepang menyerah tanpa syarat kepada Sekutu pada 14 Agustus 1945 pasca pengeboman Hiroshima dan Nagasaki, golongan pemuda (seperti Chaerul Saleh, Wikana, dan Sukarni) mendesak Ir. Soekarno dan Drs. Mohammad Hatta untuk segera memproklamasikan kemerdekaan tanpa campur tangan PPKI buatan Jepang.

Pada dini hari 16 Agustus 1945, pemuda membawa Soekarno dan Hatta ke Rengasdengklok, Karawang, untuk mengamankan keduanya dari pengaruh militer Jepang. Setelah kesepakatan dicapai dengan jaminan Mr. Ahmad Soebardjo, Soekarno-Hatta kembali ke Jakarta malam harinya.

Perumusan teks proklamasi dilakukan di kediaman Laksamana Tadashi Maeda di Jalan Imam Bonjol No. 1 Jakarta. Naskah diketik oleh Sayuti Melik dengan beberapa perubahan kata. Pada hari Jumat, 17 Agustus 1945 pukul 10.00 WIB, naskah dibacakan oleh Soekarno didampingi Hatta di Jalan Pegangsaan Timur No. 56 Jakarta, dilanjutkan dengan pengibaran bendera Merah Putih oleh Latief Hendraningrat dan Suhud Sastro Kusumo serta dinyanyikannya lagu Indonesia Raya.`
  },
  {
    id: 'fisika-newton',
    category: 'Fisika Dasar',
    title: 'Hukum Gravitasi & Dinamika Gerak Newton',
    excerpt: 'Prinsip inersia, percepatan gaya, aksi-reaksi, dan gravitasi universal.',
    text: `Hukum Gerak Newton dirumuskan oleh Sir Isaac Newton pada tahun 1687 dalam karyanya Philosophiæ Naturalis Principia Mathematica.

1. Hukum I Newton (Hukum Kelembaman/Inersia):
"Setiap benda akan tetap diam atau bergerak lurus beraturan jika resultan gaya yang bekerja pada benda sama dengan nol (ΣF = 0)." Contohnya saat mobil direm mendadak, tubuh penumpang terdorong ke depan mempertahankan keadaannya.

2. Hukum II Newton (Hukum Percepatan):
"Percepatan sebuah benda berbanding lurus dengan resultan gaya yang bekerja padanya dan berbanding terbalik dengan massanya (ΣF = m . a)." Di mana F adalah gaya (Newton), m adalah massa (kg), dan a adalah percepatan (m/s²).

3. Hukum III Newton (Hukum Aksi-Reaksi):
"Jika benda pertama memberikan gaya aksi pada benda kedua, maka benda kedua akan memberikan gaya reaksi yang besarnya sama tetapi arahnya berlawanan (F_aksi = -F_reaksi)." Gaya aksi-reaksi selalu bekerja pada dua benda yang berbeda.

Hukum Gravitasi Universal menyatakan bahwa setiap partikel di alam semesta menarik partikel lain dengan gaya yang berbanding lurus dengan perkalian massa kedua partikel dan berbanding terbalik dengan kuadrat jarak antara keduanya (F = G . (m1 . m2) / r²).`
  },
  {
    id: 'it-struktur-data',
    category: 'Informatika & Komputer',
    title: 'Algoritma & Struktur Data (Stack, Queue, Tree)',
    excerpt: 'Konsep dasar penyimpanan, manipulasi data, dan kompleksitas waktu Big-O.',
    text: `Struktur data adalah cara mengorganisir, mengelola, dan menyimpan data dalam komputer agar dapat diakses dan dimodifikasi secara efisien.

1. Array dan Linked List:
Array menyimpan elemen bertipe sama secara berurutan dalam memori fisik dengan akses acak O(1). Linked list menyimpan data dalam simpul (node) yang saling terhubung dengan pointer, memungkinkan penyisipan dan penghapusan O(1) di awal node.

2. Stack (Tumpukan):
Menerapkan prinsip LIFO (Last In, First Out). Elemen yang terakhir dimasukkan akan menjadi yang pertama dikeluarkan. Operasi utama: Push (menambahkan) dan Pop (menghapus elemen teratas). Contoh pemakaian: fungsi Undo-Redo dan Call Stack fungsi rekursif.

3. Queue (Antrean):
Menerapkan prinsip FIFO (First In, First Out). Elemen pertama masuk adalah yang pertama keluar. Operasi utama: Enqueue dan Dequeue. Contoh pemakaian: manajemen antrean printer dan CPU task scheduling.

4. Binary Search Tree (BST):
Struktur hierarkis berakar di mana setiap node memiliki maksimal dua anak. Nilai node anak kiri selalu lebih kecil dari induknya, dan nilai node anak kanan selalu lebih besar. Pencarian rata-rata bernilai O(log n).`
  }
];
