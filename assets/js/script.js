const STORAGE_KEY = "BOOKSHELF_APP";
const ID_BUKU = "BUKU";
const BUKU_SUDAH_SELESAI = "rakBukuSudahSelesai";
const BUKU_BELUM_SELESAI = "rakBukuBelumSelesai";
let daftarBuku = [];

function generateBookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    }
}

function generateBook(title, author, year, isCompleted) {
    const textJudulBuku = document.createElement('h4');
    textJudulBuku.innerText = title;
    const textPenulisBuku = document.createElement('p');
    textPenulisBuku.innerText = author;
    const textTahunBuku = document.createElement('p');
    textTahunBuku.innerText = year;
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('btn-group');

    buttonGroup.append(
        buttonCekBuku(isCompleted),
        buttonEditBuku(),
        buttonHapusBuku()
    );

    const section = document.createElement('section');
    section.classList.add('itemBuku');
    section.append(textJudulBuku, textPenulisBuku, textTahunBuku, buttonGroup);
    return section;
}

function findBook(BUKU) {
    for (book of daftarBuku) {
        if (book.id === BUKU )
            return book;
    }
    return null;
}

function findBookIndex(BUKU) {
    let index = 0
    for (book of daftarBuku) {
        if (book.id === BUKU) {
            return index;
        }
        index++;
    }
    return -1;
}

function button(buttonClassType, buttonText, eventListener) {
    const button = document.createElement('button');
    button.classList.add(buttonClassType);
    button.innerText = buttonText;
    button.addEventListener("click", function(event) {
        eventListener(event);
    });
    return button;
}

function finishedBookshelf(elemenBuku) {
    const buku = findBook(elemenBuku[ID_BUKU]);
    buku.isCompleted = true;
    const dataBuku = generateBook(buku.title, buku.author, buku.year, isCompleted = true);
    dataBuku[ID_BUKU] = buku.id;
    const listSudahSelesai = document.getElementById(BUKU_SUDAH_SELESAI);
    listSudahSelesai.append(dataBuku);

    elemenBuku.remove();
    saveDataStorage();
}

function unfinishedBookshelf(elemenBuku) {
    const buku = findBook(elemenBuku[ID_BUKU]);
    buku.isCompleted = false;
    const dataBuku = generateBook(buku.title, buku.author, buku.year, buku.isCompleted);
    dataBuku[ID_BUKU] = buku.id;
    const listBelumSelesai = document.getElementById(BUKU_BELUM_SELESAI);
    listBelumSelesai.append(dataBuku);

    elemenBuku.remove();
    saveDataStorage();
}

function buttonCekBuku(isCompleted) {
    return button('green', (isCompleted ? 'Belum Selesai Dibaca' : 'Sudah Selesai Dibaca'), function(event) {
        if (isCompleted) {
            unfinishedBookshelf(event.target.parentElement.parentElement);
        } else {
            finishedBookshelf(event.target.parentElement.parentElement);
        }
    });
}

function buttonEditBuku() {
    return button('yellow', "Edit Buku", function(event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function buttonHapusBuku() {
    return button('red', "Hapus Buku", function(event) {
        deleteBook(event.target.parentElement.parentElement);
    });
}

function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser Tidak Mendukung Local Storage");
        return false;
    }
    return true;
}

function saveData() {
    const listBuku = JSON.stringify(daftarBuku);
    localStorage.setItem(STORAGE_KEY, listBuku);
    document.dispatchEvent(new Event('onDataSaved'));
}

function saveDataStorage() {
    if (isStorageExist()) {
        saveData();
    }
}

function getData() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        daftarBuku = data;
    }
    document.dispatchEvent(new Event('onDataLoaded'));
}

function searchBook(keyword) {
    const itemBuku = document.querySelectorAll(".itemBuku");
    for (let buku of itemBuku) {
        const judulBuku = buku.childNodes[0];
        if (!judulBuku.innerText.toLowerCase().includes(keyword)) {
            judulBuku.parentElement.style.display = "none"
        } else {
            judulBuku.parentElement.style.display = "";
        }
    }
}

function addBook() {
    const listBelumSelesai = document.getElementById(BUKU_BELUM_SELESAI);
    const listSudahSelesai = document.getElementById(BUKU_SUDAH_SELESAI);
    const bookTitle = document.getElementById('judulBuku').value;
    const bookAuthor = document.getElementById('penulisBuku').value;
    const bookYear = document.getElementById('tahunBuku').value;
    const isCompleted = document.getElementById('input-checkbox').checked;
    const buku = generateBook(bookTitle, bookAuthor, bookYear, isCompleted);
    const objekBuku = generateBookObject(bookTitle, bookAuthor, bookYear,isCompleted);

    buku[ID_BUKU] = objekBuku.id;
    daftarBuku.push(objekBuku);
    if (isCompleted) {
        listSudahSelesai.append(buku);
    } else {
        listBelumSelesai.append(buku);
    }
    saveDataStorage();
}

function editBook(elemenBuku) {
    const popUpEdit = document.getElementById('popUpEdit');
    popUpEdit.style.display = "block";

    const buku = findBook(elemenBuku[ID_BUKU]);
    const editId = document.getElementById('idEditBuku');
    const editJudul = document.getElementById('judulEditBuku');
    const editPenulis = document.getElementById('penulisEditBuku');
    const editTahun = document.getElementById('tahunEditBuku');
    const editKeterangan = document.getElementById('input-checkbox-edit');

    editId.value = buku.id;
    editJudul.value = buku.title;
    editPenulis.value = buku.author;
    editTahun.value = buku.year;
    editKeterangan.checked = buku.isCompleted;

    const simpanEdit = document.querySelector(".btn-save");
    simpanEdit.addEventListener("click", function() {
        editbuku(editJudul.value, editPenulis.value, editTahun.value, editKeterangan.checked, buku.id);
        popUpEdit.style.display = "none";
    });

    const batalEdit = document.querySelector(".btn-cancel");
    batalEdit.addEventListener("click", function(event) {
        popUpEdit.style.display = "none";
        event.preventDefault();
    });

    window.onclick = function(event) {
        if (event.target == popUpEdit) {
            popUpEdit.style.display = "none";
        }
    }
}

function editbuku(title, author, year, isCompleted, Id) {
    const rakBuku = JSON.parse(localStorage[STORAGE_KEY]);
    const indexBuku  = findBookIndex(Id);

    rakBuku[indexBuku] = {
        id: Id,
        title: title,
        author: author,
        year: year,
        isCompleted: isCompleted
    }

    const buku = JSON.stringify(rakBuku);
    localStorage.setItem(STORAGE_KEY, buku);
    location.reload(true);
}

function deleteBook(elemenBuku) {
    const popUpHapus = document.getElementById('popUpHapus');
    popUpHapus.style.display = "block";
    const tombolBenar = document.querySelector('.btn-true');
    const tombolSalah = document.querySelector('.btn-false');

    tombolBenar.addEventListener("click", function() {
        const indexBook = findBookIndex(elemenBuku[ID_BUKU]);
        daftarBuku.splice(indexBook, 1);
        elemenBuku.remove();
        popUpHapus.style.display = "none";
        saveDataStorage();
    })

    tombolSalah.addEventListener("click", function() {
        popUpHapus.style.display = "none";
    })

    window.onclick = function(event) {
        if (event.target == popUpHapus) {
            popUpHapus.style.display = "none";
        }
    }
}

function getBuku() {
    const listBelumSelesai = document.getElementById(BUKU_BELUM_SELESAI);
    let listSudahSelesai = document.getElementById(BUKU_SUDAH_SELESAI);
    for (buku of daftarBuku) {
        const dataBuku = generateBook(buku.title, buku.author, buku.year, buku.isCompleted);
        dataBuku[ID_BUKU] = buku.id;
        if (buku.isCompleted) {
            listSudahSelesai.append(dataBuku);
        } else {
            listBelumSelesai.append(dataBuku);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const kirimBuku = document.getElementById('tambahBuku');
    kirimBuku.addEventListener("submit", function() {
        addBook();
    });

    const cariBukuSubmit = document.getElementById('cariBukuSubmit');
    cariBukuSubmit.addEventListener("click", function(event) {
        const keyword = document.getElementById('judul-cariBuku').value;
        searchBook(keyword.toLowerCase());
        event.preventDefault();
    });

    if (isStorageExist()) {
        getData();
    }
});

document.addEventListener("onDataSaved", () => {
    console.log("Data telah berhasil di simpan");
});

document.addEventListener("onDataLoaded", () => {
    getBuku();
})