// 1.Render songs
// 2.Scroll top
// 3.Play / Pause / Seek
// 4.CD rotate 
// 5.Next / prev 
// 6.Random
// 7.Next/ Repeat when ended 
// 8.Active song 
// 9.Scroll active song into view 
// 10. Play song when click 

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const cd = $('.cd')

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const progress = $('#progress')

const playBtn = $('.btn-toggle-play')
const player = $('.player')

const nextBtn =$('.btn-next')
const prevBtn =$('.btn-prev')

const randomBtn =$('.btn-random')
const repeatBtn =$('.btn-repeat')

const playList = $('.playlist')


const app = {
  currentIndex : 0,
  isPlaying : false,
  isRandom : false,
  isRepeat : false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./assets/music/song1.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
    },
    {
      name: "Tu Phir Se Aana",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:"https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
    },
    {
      name: "Naachne Ka Shaunq",
      singer: "Raftaar x Brobha V",
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "Mantoiyat",
      singer: "Raftaar x Nawazuddin Siddiqui",      
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:"https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
    },
    {
      name: "Aage Chal",
      singer: "Raftaar",     
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:"https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
    },
    {
      name: "Damn",
      singer: "Raftaar x kr$na",
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:"https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
    },
    {
      name: "Feeling You",
      singer: "Raftaar x Harjas",
      path: "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
      image:"https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
  ],

  // Hàm set config khi reload
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },

  // Hàm render list songs
  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class = "song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
          <div class="thumb"
            style="background-image: url('${song.image}')">
          </div>
          <div class = "body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}<p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    })
    playList.innerHTML = htmls.join('')
  },

  // Hàm định nghĩa các thuộc tính
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })
  },

  // Hàm xử lý các sự kiện 
  handleEvents: function() {
    const _this = this 
    const cdWidth = cd.offsetWidth
    
    // Xử lý phóng to/thu nhở cd khi scroll
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop
      
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
      cd.style.opacity = newCdWidth / cdWidth 
    }

    // Xử lý khi click play button
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }
    // Khi song pausing
    audio.onpause = function() {
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    }
    // Khi song playing
    audio.onplay = function() {
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()
    }

    // Khi tiến độ song thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      } 
    } 
    // Khi tua song
    progress.onchange = function (e) {
      const seekTime = audio.duration/100 * e.target.value
      audio.currentTime =  seekTime
    }

    // xử lý cd quay
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate.pause()

    // Khi click next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.nextSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }
    // Khi click prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
      } else {
        _this.prevSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }


    // Bật/Tắt random button
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom
      this.classList.toggle('active', _this.isRandom)

      _this.setConfig('isRandom', _this.isRandom)
    }


    // Bật/Tắt repeat song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat
      this.classList.toggle('active', _this.isRepeat)

      _this.setConfig('isRepeat', _this.isRepeat)
    }

    // Khi song end -> next song
    audio.onended = function () {
      // console.log('end')
      if (_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click()
      }
    }


    // Khi click vào play list
    playList.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode || e.target.closest('.option')) {
        // Xử lý khi click song trong play list
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
        }

        // Xử lý khi click icon option trong song trong play list
        if (e.target.closest('.option')) {
          // null

        }

        // console.log(e.target) 
      }
    }

  },

  // Hàm hiển thị song mặc định
  loadCurrentSong: function () {
    
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`
    audio.src = this.currentSong.path

    // console.log(heading, cdThumb, audio)

  },

  // Hàm next song
  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  // Hàm prev song
  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },

  // Hàm chạy random song
  playRandomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() *this.songs.length)
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex
    this.loadCurrentSong()
    // console.log(newIndex)
  },

  // Hàm scroll to active song
  scrollToActiveSong : function () {
    setTimeout(() => {
       $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
       })
    }, 200)
  },


  // Hàm load config
  loadConfig : function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },

  // Hàm khởi chạy
  start: function () {
    // Load confid 
    this.loadConfig();
    // Hiện thị trạng thái ban đầu btn repeat,random
    randomBtn.classList.toggle('active', this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)


    // Xử lý sự kiện
    this.handleEvents();

    // Định nghĩa thuộc tính
    this.defineProperties();

    // Hiện thị thông tin bài đầu tiên khi mới khởi chạy
    this.loadCurrentSong();

    // Render list sóng
    this.render();

  },
}

app.start();