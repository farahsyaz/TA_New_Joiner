import {
  beforeEach,
  describe,
  expect,
  it
} from "vitest";


import {
  bootFrontend,
  checkRadio,
  clickNext,
  createPdfFile,
  fillValidForm,
  fillValidPage2,
  fillValidPage3,
  getById,
  getPostCalls,
  getPostPayload,
  getVisiblePage,
  installFileState,
  openSubmitConfirmation,
  selectValue,
  setCheckbox,
  setFile,
  setInputValue,
  waitUntil
} from "./test-utils.js";


/* ======================================================
   CLEAN STATE
   ====================================================== */

beforeEach(
  () => {

    document.body.innerHTML =
      "";


    localStorage.clear();


    delete window.__POWER_AUTOMATE_URL__;

  }
);


/* ======================================================
   TEST SUITE
   ====================================================== */

describe(
  "LinkAja New Joiner Form - Frontend Unit Tests",
  () => {


    it(
      "menampilkan halaman Intro saat pertama kali dibuka",
      async () => {

        await bootFrontend();


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "1"
        );


        expect(
          document
            .querySelector(
              '[data-step-indicator="1"]'
            )
            .classList
            .contains(
              "is-active"
            )
        ).toBe(
          true
        );

      }
    );


    it(
      "berpindah dari Intro ke Informasi Pribadi ketika Next diklik",
      async () => {

        await bootFrontend();


        clickNext(
          1
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "2"
        );

      }
    );


    it(
      "tidak mengizinkan lanjut jika field wajib halaman 2 masih kosong",
      async () => {

        await bootFrontend();


        clickNext(
          1
        );


        clickNext(
          2
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "2"
        );


        expect(
          getById(
            "pageTwoStatus"
          ).textContent
        ).toContain(
          "Mohon lengkapi"
        );

      }
    );


    it(
      "menonaktifkan field domisili ketika alamat sama dengan KTP",
      async () => {

        await bootFrontend();


        setCheckbox(
          "alamatSamaDenganKtp",
          true
        );


        const panel =
          getById(
            "domicileFields"
          );


        expect(
          panel.classList.contains(
            "is-hidden"
          )
        ).toBe(
          true
        );


        panel
          .querySelectorAll(
            "input, select"
          )
          .forEach(
            (field) => {

              expect(
                field.disabled
              ).toBe(
                true
              );

            }
          );

      }
    );


    it(
      "mengirim alamat domisili berbeda dari KTP ketika toggle = TIDAK",
      async () => {

        const {
          fetchMock
        } =
          await bootFrontend();


        await fillValidForm({
          sameAsKtp:
            false
        });


        openSubmitConfirmation();


        getById(
          "confirmSubmitButton"
        ).click();


        await waitUntil(
          () => {

            expect(
              getPostCalls(
                fetchMock
              )
            ).toHaveLength(
              1
            );

          }
        );


        const payload =
          getPostPayload(
            fetchMock
          );


        expect(
          payload.AlamatSamaDenganKTP
        ).toBe(
          "TIDAK"
        );


        expect(
          payload.AlamatKTP
        ).toBe(
          "Jl. KTP Test No. 1"
        );


        expect(
          payload.AlamatDomisili
        ).toBe(
          "Jl. Domisili Test No. 2"
        );


        expect(
          payload.ProvinsiDomisili
        ).toBe(
          "JAWA BARAT"
        );

      }
    );


    it(
      "menampilkan dan mewajibkan data pasangan ketika toggle pasangan = YA",
      async () => {

        await bootFrontend();


        setCheckbox(
          "memilikiPasangan",
          true
        );


        expect(
          getById(
            "partnerFields"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          false
        );


        expect(
          getById(
            "namaPasangan"
          ).required
        ).toBe(
          true
        );


        expect(
          getById(
            "nomorKtpPasangan"
          ).required
        ).toBe(
          true
        );


        expect(
          getById(
            "lampiranKtpPasangan"
          ).required
        ).toBe(
          true
        );

      }
    );


    it(
      "menonaktifkan pasangan lagi saat toggle berubah YA ke TIDAK dan tidak memasukkannya ke payload",
      async () => {

        const {
          fetchMock
        } =
          await bootFrontend();


        await fillValidForm();


        setCheckbox(
          "memilikiPasangan",
          true
        );


        setInputValue(
          "namaPasangan",
          "Pasangan Lama"
        );


        setInputValue(
          "nomorKtpPasangan",
          "3171234567890999"
        );


        setFile(
          "lampiranKtpPasangan",
          createPdfFile(
            "KTP_Pasangan.pdf"
          )
        );


        setCheckbox(
          "memilikiPasangan",
          false
        );


        expect(
          getById(
            "partnerFields"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          true
        );


        openSubmitConfirmation();


        getById(
          "confirmSubmitButton"
        ).click();


        await waitUntil(
          () => {

            expect(
              getPostCalls(
                fetchMock
              )
            ).toHaveLength(
              1
            );

          }
        );


        const payload =
          getPostPayload(
            fetchMock
          );


        expect(
          payload.MemilikiPasangan
        ).toBe(
          "TIDAK"
        );


        expect(
          payload.NamaPasangan
        ).toBe(
          ""
        );


        expect(
          payload.attachments.some(
            (attachment) =>
              attachment.fieldName ===
              "LampiranKTPPasangan"
          )
        ).toBe(
          false
        );

      }
    );


    it(
      "menolak data anak jika hanya nama anak yang diisi",
      async () => {

        await bootFrontend();


        clickNext(
          1
        );


        await fillValidPage2();


        clickNext(
          2
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "3"
        );


        await fillValidPage3();


        setCheckbox(
          "memilikiAnak",
          true
        );


        setInputValue(
          "namaAnakPertama",
          "Anak Test"
        );


        clickNext(
          3
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "3"
        );


        expect(
          getById(
            "lampiranAnakPertama"
          ).checkValidity()
        ).toBe(
          false
        );


        expect(
          getById(
            "lampiranAnakPertama"
          ).validationMessage
        ).not.toBe(
          ""
        );

      }
    );


    it(
      "menolak data anak jika hanya file anak yang diisi",
      async () => {

        await bootFrontend();


        clickNext(
          1
        );


        await fillValidPage2();


        clickNext(
          2
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "3"
        );


        await fillValidPage3();


        setCheckbox(
          "memilikiAnak",
          true
        );


        setFile(
          "lampiranAnakPertama",
          createPdfFile(
            "Anak_Test.pdf"
          )
        );


        clickNext(
          3
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "3"
        );


        expect(
          getById(
            "namaAnakPertama"
          ).checkValidity()
        ).toBe(
          false
        );


        expect(
          getById(
            "namaAnakPertama"
          ).validationMessage
        ).not.toBe(
          ""
        );

      }
    );


    it(
      "menolak anak kedua dan ketiga yang diisi setengah-setengah",
      async () => {

        await bootFrontend();


        clickNext(
          1
        );


        await fillValidPage2();


        clickNext(
          2
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "3"
        );


        await fillValidPage3();


        setCheckbox(
          "memilikiAnak",
          true
        );


        setInputValue(
          "namaAnakPertama",
          "Anak Pertama"
        );


        setFile(
          "lampiranAnakPertama",
          createPdfFile(
            "Anak_Pertama.pdf"
          )
        );


        setInputValue(
          "namaAnakKedua",
          "Anak Kedua"
        );


        setFile(
          "lampiranAnakKetiga",
          createPdfFile(
            "Anak_Ketiga.pdf"
          )
        );


        clickNext(
          3
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "3"
        );


        expect(
          getById(
            "lampiranAnakKedua"
          ).checkValidity()
        ).toBe(
          false
        );


        expect(
          getById(
            "namaAnakKetiga"
          ).checkValidity()
        ).toBe(
          false
        );

      }
    );


    it(
      "menampilkan field Nama Bank Lainnya ketika memilih Lainnya",
      async () => {

        await bootFrontend();


        selectValue(
          "namaBank",
          "Lainnya"
        );


        expect(
          getById(
            "otherBankField"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          false
        );


        expect(
          getById(
            "namaBankLainnya"
          ).required
        ).toBe(
          true
        );

      }
    );


    it(
      "menyembunyikan dan membersihkan Nama Bank Lainnya saat kembali memilih bank biasa",
      async () => {

        await bootFrontend();


        selectValue(
          "namaBank",
          "Lainnya"
        );


        setInputValue(
          "namaBankLainnya",
          "Bank Test"
        );


        selectValue(
          "namaBank",
          "Bank Mandiri"
        );


        expect(
          getById(
            "otherBankField"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          true
        );


        expect(
          getById(
            "namaBankLainnya"
          ).value
        ).toBe(
          ""
        );

      }
    );


    it(
      "menampilkan field unit lainnya ketika Group/Unit = Other lalu membersihkannya saat kembali normal",
      async () => {

        await bootFrontend();


        selectValue(
          "direktorat",
          "Technology"
        );


        selectValue(
          "groupUnit",
          "Other"
        );


        expect(
          getById(
            "otherUnitField"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          false
        );


        setInputValue(
          "groupUnitLainnya",
          "Custom Unit"
        );


        selectValue(
          "groupUnit",
          "Business Support Systems Sub Unit"
        );


        expect(
          getById(
            "otherUnitField"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          true
        );


        expect(
          getById(
            "groupUnitLainnya"
          ).value
        ).toBe(
          ""
        );

      }
    );


    it(
      "menggunakan fallback organization dan recruiter jika CSV return HTTP error",
      async () => {

        await bootFrontend({
          csvMode:
            "httpError"
        });


        const directorates =
          Array.from(
            getById(
              "direktorat"
            ).options
          ).map(
            (option) =>
              option.value
          );


        const recruiters =
          Array.from(
            getById(
              "recruiter"
            ).options
          ).map(
            (option) =>
              option.value
          );


        expect(
          directorates
        ).toContain(
          "CEO Office"
        );


        expect(
          recruiters
        ).toContain(
          "Audy Atira Pramono"
        );

      }
    );


    it(
      "menggunakan fallback organization dan recruiter jika fetch CSV gagal",
      async () => {

        await bootFrontend({
          csvMode:
            "networkError"
        });


        const directorates =
          Array.from(
            getById(
              "direktorat"
            ).options
          ).map(
            (option) =>
              option.value
          );


        expect(
          directorates
        ).toContain(
          "Technology"
        );

      }
    );


    it(
      "mengisi dropdown wilayah secara cascading",
      async () => {

        await bootFrontend();


        selectValue(
          "provinsiKtp",
          "DKI JAKARTA"
        );


        expect(
          getById(
            "kotaKtp"
          ).disabled
        ).toBe(
          false
        );


        selectValue(
          "kotaKtp",
          "KOTA JAKARTA PUSAT"
        );


        selectValue(
          "kecamatanKtp",
          "GAMBIR"
        );


        expect(
          Array.from(
            getById(
              "kelurahanKtp"
            ).options
          ).some(
            (option) =>
              option.value ===
              "GAMBIR"
          )
        ).toBe(
          true
        );

      }
    );


    it(
      "menolak file yang bukan PDF",
      async () => {

        await bootFrontend();


        const invalidFile =
          new File(
            [
              "hello"
            ],
            "ktp.txt",
            {
              type:
                "text/plain"
            }
          );


        const input =
          setFile(
            "lampiranKtp",
            invalidFile
          );


        expect(
          input.checkValidity()
        ).toBe(
          false
        );


        expect(
          input
            .closest(
              ".upload-field"
            )
            .classList
            .contains(
              "has-error"
            )
        ).toBe(
          true
        );

      }
    );


    it(
      "menolak PDF yang ukurannya lebih dari 5 MB",
      async () => {

        await bootFrontend();


        const oversizedFile =
          createPdfFile(
            "large.pdf",
            (
              5 *
              1024 *
              1024
            ) + 1
          );


        const input =
          setFile(
            "lampiranKtp",
            oversizedFile
          );


        expect(
          input.checkValidity()
        ).toBe(
          false
        );

      }
    );


    it(
      "menerima file PDF valid di bawah 5 MB",
      async () => {

        await bootFrontend();


        const input =
          setFile(
            "lampiranKtp",
            createPdfFile(
              "KTP_Ara.pdf",
              1024
            )
          );


        expect(
          input
            .closest(
              ".upload-field"
            )
            .classList
            .contains(
              "has-file"
            )
        ).toBe(
          true
        );


        expect(
          input.files
        ).toHaveLength(
          1
        );

      }
    );


    it(
      "bisa menghapus attachment opsional yang sudah dipilih",
      async () => {

        await bootFrontend();


        const input =
          setFile(
            "lampiranBpjsKesehatan",
            createPdfFile(
              "BPJS_Kesehatan.pdf"
            )
          );


        const removeButton =
          document.querySelector(
            '[data-remove-file="lampiranBpjsKesehatan"]'
          );


        expect(
          input.files
        ).toHaveLength(
          1
        );


        removeButton.click();


        expect(
          input.files
        ).toHaveLength(
          0
        );

      }
    );


    it(
      "menerima PDF melalui drag-and-drop",
      async () => {

        await bootFrontend();


        const input =
          getById(
            "lampiranKtp"
          );


        installFileState(
          input,
          []
        );


        const uploadBox =
          input
            .closest(
              ".upload-field"
            )
            .querySelector(
              ".upload-box"
            );


        const droppedFile =
          createPdfFile(
            "KTP_Drop.pdf",
            2048
          );


        const dropEvent =
          new Event(
            "drop",
            {
              bubbles:
                true,

              cancelable:
                true
            }
          );


        Object.defineProperty(
          dropEvent,
          "dataTransfer",
          {

            configurable:
              true,


            value: {

              files: [
                droppedFile
              ]

            }

          }
        );


        uploadBox.dispatchEvent(
          dropEvent
        );


        expect(
          input.files
        ).toHaveLength(
          1
        );


        expect(
          input.files[0].name
        ).toBe(
          "KTP_Drop.pdf"
        );

      }
    );


    it(
      "menolak lanjut jika file wajib masih kosong",
      async () => {

        await bootFrontend();


        clickNext(
          1
        );


        await fillValidPage2();


        clickNext(
          2
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "3"
        );


        await fillValidPage3({
          skipFiles: [
            "lampiranKtp"
          ]
        });


        clickNext(
          3
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "3"
        );


        expect(
          getById(
            "lampiranKtp"
          )
            .closest(
              ".upload-field"
            )
            .classList
            .contains(
              "has-error"
            )
        ).toBe(
          true
        );

      }
    );


    it(
      "menampilkan confirmation modal sebelum data dikirim",
      async () => {

        await bootFrontend();


        await fillValidForm();


        openSubmitConfirmation();


        expect(
          getById(
            "submitConfirmModal"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          false
        );


        expect(
          getById(
            "confirmSubmitButton"
          ).textContent.trim()
        ).toBe(
          "Ya, Kirim Data"
        );

      }
    );


    it(
      "tidak mengirim data ketika user memilih Periksa Lagi",
      async () => {

        const {
          fetchMock
        } =
          await bootFrontend();


        await fillValidForm();


        openSubmitConfirmation();


        getById(
          "cancelSubmitButton"
        ).click();


        expect(
          getPostCalls(
            fetchMock
          )
        ).toHaveLength(
          0
        );

      }
    );


    it(
      "membangun payload, mengirim sekali, lalu menampilkan halaman sukses",
      async () => {

        const {
          fetchMock
        } =
          await bootFrontend();


        await fillValidForm();


        openSubmitConfirmation();


        /*
         * Modal benar-benar harus terbuka
         * sebelum confirm ditekan.
         */

        expect(
          getById(
            "submitConfirmModal"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          false
        );


        getById(
          "confirmSubmitButton"
        ).click();


        getById(
          "confirmSubmitButton"
        ).click();


        await waitUntil(
          () => {

            expect(
              getPostCalls(
                fetchMock
              )
            ).toHaveLength(
              1
            );

          }
        );


        const payload =
          getPostPayload(
            fetchMock
          );


        /* ==================================================
           PERSONAL DATA
           ================================================== */

        expect(
          payload.NamaDepan
        ).toBe(
          "Ara"
        );


        expect(
          payload.NamaTengah
        ).toBe(
          "Rizkita"
        );


        expect(
          payload.NamaBelakang
        ).toBe(
          "Setiadji"
        );


        /*
         * NEW FIELDS.
         */

        expect(
          payload.Agama
        ).toBe(
          "Islam"
        );


        expect(
          payload.MaritalStatus
        ).toBe(
          "Belum Menikah"
        );


        expect(
          payload.EmailPribadi
        ).toBe(
          "ara.test@example.com"
        );


        expect(
          payload.AlamatSamaDenganKTP
        ).toBe(
          "YA"
        );


        expect(
          payload.AlamatDomisili
        ).toBe(
          payload.AlamatKTP
        );


        /* ==================================================
           CONDITIONAL DATA
           ================================================== */

        expect(
          payload.MemilikiPasangan
        ).toBe(
          "TIDAK"
        );


        expect(
          payload.MemilikiAnak
        ).toBe(
          "TIDAK"
        );


        /* ==================================================
           ATTACHMENTS
           ================================================== */

        /*
         * Sebelumnya 6.
         *
         * Sekarang 7 karena:
         *
         * CaptureAccountTypeLinkAja
         * merupakan required attachment baru.
         */

        expect(
          payload.attachments
        ).toHaveLength(
          7
        );


        expect(
          payload.attachments.map(
            (attachment) =>
              attachment.fieldName
          )
        ).toEqual(
          expect.arrayContaining(
            [
              "CaptureAccountTypeLinkAja",
              "LampiranKTP",
              "LampiranKartuKeluarga",
              "LampiranNPWP",
              "LampiranBukuTabungan",
              "LampiranIjazah",
              "SignedOfferProposal"
            ]
          )
        );


        payload.attachments.forEach(
          (attachment) => {

            expect(
              attachment.content
            ).not.toMatch(
              /^data:/
            );


            expect(
              attachment.mimeType
            ).toBe(
              "application/pdf"
            );

          }
        );


        expect(
          payload.submissionId
        ).toMatch(
          /^NJ-/
        );


        expect(
          payload.timestamp
        ).toBeTruthy();


        await waitUntil(
          () => {

            expect(
              getById(
                "submissionSuccess"
              ).classList.contains(
                "is-hidden"
              )
            ).toBe(
              false
            );

          }
        );


        expect(
          getById(
            "newJoinerForm"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          true
        );


        /*
         * Development localhost tidak boleh lock.
         */

        expect(
          localStorage.getItem(
            "linkajaNewJoinerSubmitted"
          )
        ).toBeNull();

      }
    );


    it.each(
      [
        400,
        500
      ]
    )(
      "tetap membuka form untuk retry jika backend mengembalikan HTTP %s",
      async (
        status
      ) => {

        const {
          fetchMock
        } =
          await bootFrontend({

            backendMode:
              "httpError",


            httpStatus:
              status,


            suppressConsoleError:
              true

          });


        await fillValidForm();


        openSubmitConfirmation();


        expect(
          getById(
            "submitConfirmModal"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          false
        );


        getById(
          "confirmSubmitButton"
        ).click();


        await waitUntil(
          () => {

            expect(
              getPostCalls(
                fetchMock
              )
            ).toHaveLength(
              1
            );


            expect(
              getById(
                "confirmSubmitButton"
              ).disabled
            ).toBe(
              false
            );

          }
        );


        expect(
          getById(
            "submissionSuccess"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          true
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "4"
        );

      }
    );


    it(
      "tetap membuka form untuk retry jika fetch backend reject karena network error",
      async () => {

        const {
          fetchMock
        } =
          await bootFrontend({

            backendMode:
              "networkError",


            suppressConsoleError:
              true

          });


        await fillValidForm();


        openSubmitConfirmation();


        getById(
          "confirmSubmitButton"
        ).click();


        await waitUntil(
          () => {

            expect(
              getPostCalls(
                fetchMock
              )
            ).toHaveLength(
              1
            );


            expect(
              getById(
                "confirmSubmitButton"
              ).disabled
            ).toBe(
              false
            );

          }
        );


        expect(
          getById(
            "submissionSuccess"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          true
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "4"
        );

      }
    );


    it(
      "tetap sukses jika response backend 200 tetapi body bukan JSON",
      async () => {

        const {
          fetchMock
        } =
          await bootFrontend({
            backendMode:
              "nonJson"
          });


        await fillValidForm();


        openSubmitConfirmation();


        getById(
          "confirmSubmitButton"
        ).click();


        await waitUntil(
          () => {

            expect(
              getPostCalls(
                fetchMock
              )
            ).toHaveLength(
              1
            );


            expect(
              getById(
                "submissionSuccess"
              ).classList.contains(
                "is-hidden"
              )
            ).toBe(
              false
            );

          }
        );

      }
    );


    it(
      "mengabaikan stale localStorage lock saat berjalan di localhost development",
      async () => {

        await bootFrontend();


        localStorage.setItem(
          "linkajaNewJoinerSubmitted",
          "true"
        );


        localStorage.setItem(
          "linkajaNewJoinerSubmissionId",
          "NJ-OLD-TEST"
        );


        window.dispatchEvent(
          new Event(
            "pageshow"
          )
        );


        window.dispatchEvent(
          new Event(
            "popstate"
          )
        );


        expect(
          getById(
            "submissionSuccess"
          ).classList.contains(
            "is-hidden"
          )
        ).toBe(
          true
        );


        expect(
          getVisiblePage()
            ?.dataset
            .formPage
        ).toBe(
          "1"
        );

      }
    );


    it(
      "menggunakan fallback submission ID jika crypto.randomUUID tidak tersedia",
      async () => {

        const {
          fetchMock
        } =
          await bootFrontend();


        await fillValidForm();


        const originalDescriptor =
          Object.getOwnPropertyDescriptor(
            window.crypto,
            "randomUUID"
          );


        Object.defineProperty(
          window.crypto,
          "randomUUID",
          {

            configurable:
              true,


            value:
              undefined

          }
        );


        try {

          openSubmitConfirmation();


          getById(
            "confirmSubmitButton"
          ).click();


          await waitUntil(
            () => {

              expect(
                getPostCalls(
                  fetchMock
                )
              ).toHaveLength(
                1
              );

            }
          );


          const payload =
            getPostPayload(
              fetchMock
            );


          expect(
            payload.submissionId
          ).toMatch(
            /^NJ-\d+-[A-Z0-9]+$/
          );


        } finally {

          if (
            originalDescriptor
          ) {

            Object.defineProperty(
              window.crypto,
              "randomUUID",
              originalDescriptor
            );

          } else {

            delete window.crypto.randomUUID;

          }

        }

      }
    );


    it(
      "radio LokasiKerja dapat dipilih normal setelah data halaman 4 diisi",
      async () => {

        await bootFrontend();


        checkRadio(
          "LokasiKerja",
          "Yogyakarta"
        );


        const selected =
          document.querySelector(
            'input[name="LokasiKerja"]:checked'
          );


        expect(
          selected?.value
        ).toBe(
          "Yogyakarta"
        );

      }
    );

  }
);