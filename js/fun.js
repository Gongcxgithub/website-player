function Player(musicArr) {
	this.audio = document.getElementsByTagName('audio')[0];
	this.singer = document.getElementById('singer');
	this.song = document.getElementById('song');
	this.lineBar = document.getElementById('line');
	this.lineBar1 = document.getElementById('line1');
	this.circleBar = document.getElementById('circle');

	this.musicArr = musicArr;
	this.timer;
	this.lrcTimer;
	this.index = 0;
	this.isPlay = true;
	this.audio.volume = 0.5;
	this.audio.loop = false;

	this.playAndPause();
	this.nextSong();
	this.prevSong();
	this.progressJump();
	this.volumeUpAndOff();
	this.orderAndRepeat();
	this.progressShow();
	
	this.loadDataList();
	this.clickList();
}
Player.prototype = {
	init: function() {
		this.audio.src = this.musicArr[this.index].musicSrc;
		this.singer.innerHTML = this.musicArr[this.index].musicSinger;
		this.song.innerHTML = this.musicArr[this.index].musicName;

		this.audio.currentTime = 0;
		this.circleBar.style.left = 0;
		this.lineBar1.style.width = 0;

		if(!this.isPlay) {
            this.audio.pause();
		}
		var self = this;
		EventUtil.addHandler(self.audio, 'ended', function() {
			if(self.loop) {
				return;
			} else {
				self.index = ++self.index % self.musicArr.length;
				self.init();
			}
		});	

		this.lyricShow();

	},
	// 根据歌曲数组生成歌曲列表
	loadDataList: function() {
		var self = this;
		var tbody = document.getElementsByTagName('tbody')[0];
		for(var i = 0; i < this.musicArr.length; i++) {
			var trNew = document.createElement('tr');
			var tdSong = document.createElement('td');
			var tdSinger = document.createElement('td');
			trNew.className = i;
			tdSong.innerHTML = this.musicArr[i].musicName;
			tdSinger.innerHTML = this.musicArr[i].musicSinger;
			trNew.appendChild(tdSong);
			trNew.appendChild(tdSinger);
			tbody.appendChild(trNew);
		}
	},
	// 点击列表播放对应歌曲
	clickList: function() {
		var self = this;
		var tr = document.getElementsByTagName('tr')
		for(var i = 0; i < tr.length; i++) {
			EventUtil.addHandler(tr[i], 'click', function() {
				self.index = this.className;
				// console.log(self.index);
				self.init();
			});
		}
	},
	// 暂停和继续
	playAndPause: function() {
		var playBlock = document.getElementById('play-pause');
		var playBtn = document.getElementById('play');
		var pauseBtn = document.getElementById('pause');
		var self = this;
		playBtn.style.display = "none";
		pauseBtn.style.display = "block";

        EventUtil.addHandler(playBlock, 'click', function() {
        	if(self.isPlay) {
				self.audio.pause();
				self.isPlay = false;
				playBtn.style.display = "block";
				pauseBtn.style.display = "none";
			} else {
				self.audio.play();
				self.isPlay = true;
				playBtn.style.display = "none";
				pauseBtn.style.display = "block";
			}
        });
	},
	// 下一首
	nextSong: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var nextBtn = document.getElementById('next');
		var self = this;

        EventUtil.addHandler(nextBtn, 'click', function() {
            self.index = ++self.index%self.musicArr.length;
			curTime.innerHTML = "00:00";
			endTime.innerHTML = " / 00:00";
			self.init();
        });
	},
	// 上一首
	prevSong: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var prevBtn = document.getElementById('prev');
		var self = this;

        EventUtil.addHandler(prevBtn, 'click', function() {
        	self.index = (--self.index + self.musicArr.length)%self.musicArr.length;
			curTime.innerHTML = "00:00";
			endTime.innerHTML = " / 00:00";
			self.init();
        });
	},
	// 进度跳转
	progressJump: function() {
		var self = this;
		var musicBox = document.getElementById('music-box');
		var progressBlock = document.getElementById('play-progress');

        EventUtil.addHandler(self.lineBar, 'mousedown',function(event) {
			var event = EventUtil.getEvent(event);
			// 获取鼠标与进度条开始处的距离
			var x = parseInt(event.clientX - progressBlock.offsetLeft - musicBox.offsetLeft - self.circleBar.offsetWidth / 2);
			// 超出边界情况
			if(x < 0) {
				x = 0;
			}
			if(x > self.lineBar.offsetWidth + self.circleBar.offsetWidth / 2) {
				x = self.lineBar.offsetWidth + self.circleBar.offsetWidth / 2;
			}

			self.circleBar.style.left = x + "px";
			self.lineBar1.style.width = x + "px";
			self.audio.currentTime = x / self.lineBar.offsetWidth * self.audio.duration;
		});
		
	},
	// 静音开启与关闭
	volumeUpAndOff: function() {
		var volumeBlock = document.getElementById('volume-up-off');
		var volumeUpBtn = document.getElementById('volume-up');
		var volumeOffBtn = document.getElementById('volume-off');
		var self = this;

        EventUtil.addHandler(volumeBlock, 'click',function() {
			if(self.audio.volume > 0) {
				volumeUpBtn.style.display = "none";
				volumeOffBtn.style.display = "block";
				self.audio.volume = 0;
			} else {
				volumeUpBtn.style.display = "block";
				volumeOffBtn.style.display = "none";
				self.audio.volume = 0.5;
			}
	    });
	},
	// 顺序播放和循环播放
	orderAndRepeat: function() {
		var orderBlock = document.getElementById('order-repeat');
		var orderBtn = document.getElementById('order');
		var repeatBtn = document.getElementById('repeat');
		var self = this;

        EventUtil.addHandler(orderBlock, 'click',function() {
			if(self.audio.loop) {
				orderBtn.style.display = "block";
				repeat.style.display = "none";
				self.audio.loop = false;
			} else {
				orderBtn.style.display = "none";
				repeatBtn.style.display = "block";
				self.audio.loop = true;
			}
		});
	},
	// 显示播放进度
	progressShow: function() {
		var curTime = document.getElementById('cur-time');
		var endTime = document.getElementById('end-time');
		var self = this;
		// 播放时间显示
		EventUtil.addHandler(self.audio, 'canplay', function() {
			var endTim = Math.floor(this.duration);
			var endMin = Math.floor(endTim / 60);
			var endSec = endTim % 60;
			endTime.innerHTML = "/ " + endMin + ":" + endSec;
		});
		// 进度条更新
		clearInterval(this.timer);
		this.timer = setInterval(function() {
			var curTim = Math.floor(self.audio.currentTime);
			var curMin = Math.floor(curTim / 60);
			var curSec = curTim % 60;
			curMin = curMin >= 10 ? curMin : '0' + curMin;
            curSec = curSec >= 10 ? curSec : '0' + curSec;
            curTime.innerHTML = curMin + ":" + curSec;

            self.circleBar.style.left = parseInt(self.audio.currentTime / self.audio.duration * self.lineBar.offsetWidth) + "px";
            self.lineBar1.style.width = parseInt(self.audio.currentTime / self.audio.duration * self.lineBar.offsetWidth) + "px"
		},500);
	},
	// 显示歌词
	lyricShow: function() {
		var lrcBlock = document.getElementById('lyric');
		var lrcPara = lrcBlock.getElementsByTagName('p');
		var timeArr = new Array();
		var lrcArr = new Array();
		var minArr = new Array();
		var secArr = new Array();
		var secTotal = new Array();
		var self = this;

		var str = self.musicArr[self.index].musicLrc.split('[');
		
		for(var i = 1; i < str.length; i++) {
			var j = i - 1;
			// str[0] == ""
			// str[i] == 00:00.00]童话镇
			// timeArr[j] == 00:00
			// lrcArr[j] == 童话镇
			// minArr[j] == 00
			// secArr[j] == 00.00
			// secTotal == 0
			timeArr[j] = str[i].split(']')[0];
			lrcArr[j] = str[i].split(']')[1];
			minArr[j] = timeArr[j].split(':')[0];
			secArr[j] = timeArr[j].split(':')[1];
			secTotal[j] = parseInt(minArr[j]) * 60 + parseInt(secArr[j]);
		}
		// 歌词更新
		clearInterval(self.lrcTimer);
		self.lrcTimer = setInterval(function() {
			for(var i = 0; i < lrcPara.length; i++) {
				lrcPara[i].style.color = "#000";
			}
			var secDiffer = secTotal.map(function(item,index,array) {
				return parseInt(item - self.audio.currentTime);
			})
			for(var k = 0; k < secDiffer.length; k++) {
				if(secDiffer[k] == 0) {
					var lrcIndex = k;
					// lrcPara[lrcIndex%6].style.color = "rgb(247,209,0)";
					if(lrcIndex < 6) {
						lrcPara[0].innerHTML = lrcArr[0];
						lrcPara[1].innerHTML = lrcArr[1];
						lrcPara[2].innerHTML = lrcArr[2];
						lrcPara[3].innerHTML = lrcArr[3];
						lrcPara[4].innerHTML = lrcArr[4];
						lrcPara[5].innerHTML = lrcArr[5];
					} else if(lrcIndex > lrcArr.length - 6) {
						lrcPara[0].innerHTML = lrcArr[lrcArr.length - 5];
						lrcPara[1].innerHTML = lrcArr[lrcArr.length - 4];
						lrcPara[2].innerHTML = lrcArr[lrcArr.length - 3];
						lrcPara[3].innerHTML = lrcArr[lrcArr.length - 2];
						lrcPara[4].innerHTML = lrcArr[lrcArr.length - 1];
						lrcPara[5].innerHTML = lrcArr[lrcArr.length];
					} else {
						var tempIndex = lrcIndex;
						lrcPara[1].innerHTML = lrcArr[--tempIndex];
						lrcPara[0].innerHTML = lrcArr[--tempIndex];
						lrcPara[2].innerHTML = lrcArr[lrcIndex];
						lrcPara[3].innerHTML = lrcArr[++lrcIndex];
						lrcPara[4].innerHTML = lrcArr[++lrcIndex];
						lrcPara[5].innerHTML = lrcArr[++lrcIndex];
					}
				}
			}
		},500);
	}
}

var musicArr = [{
	musicSinger: '沙雕少年-可乐君', 
	musicName: '沙雕之歌', 
	musicSrc: 'https://gong-cx.coding.net/p/my_file/d/currency/git/raw/main/music/sdzg.mp3',
	musicLrc: '[00:00.00]沙雕之歌 - 沙雕少年可乐君[00:00.78]词：Teac[00:01.57]曲：Teac[00:02.36]编曲：Teac[00:03.15]（未经许可,不得翻唱或使用）[00:31.77]我是沙雕[00:34.14]在大街招摇[00:35.96]我是沙雕[00:37.92]孩子在大街乱跑[00:40.02]我是沙雕[00:41.84]每天吃得饱[00:43.87]我是沙雕[00:45.93]天天精神都很好[00:48.13]虽说我是沙雕[00:49.93]也想过得好[00:52.05]虽说我是沙[00:54.02]不想把饭来讨[00:56.05]虽说我是沙雕[00:57.96]也想睡好觉[00:59.97]虽说我是沙雕[01:01.97]好日子会来到[01:04.00]虽说沙雕是我本性[01:05.94]也不再相信感情[01:07.92]虽说沙雕已[01:10.17]也不想再当舔狗[01:12.08]虽说沙雕只会发呆[01:14.03]不想被说成痴呆[01:16.09]虽说沙雕就是沙雕[01:18.03]也希望要有人爱[01:36.20]我是沙雕[01:37.99]在大街招摇[01:39.91]我是沙[01:41.96]孩子在大街乱跑[01:44.14]我是沙雕[01:45.96]每天吃得饱[01:47.91]我是沙雕[01:49.98]天天精神都很好[01:52.12]虽说我是沙雕[01:53.97]也想过得好[01:55.97]虽说我是沙雕[01:57.94]不想把饭来讨[02:00.07]虽说我是沙雕[02:01.98]也想睡好觉[02:03.75]虽说我是沙雕[02:05.98]好日子会来到[02:08.04]虽说沙雕是我本性[02:10.09]也不再相信感情[02:11.92]虽说沙雕已经活够[02:14.06]也不想再当舔狗[02:15.98]虽说沙雕只会发呆[02:18.02]不想被说成痴呆[02:19.99]虽说沙雕就是沙雕[02:22.05]也希望要有人爱'
},{
	musicSinger: 'Azis', 
	musicName: 'Hop', 
	musicSrc: 'https://gong-cx.coding.net/p/my_file/d/currency/git/raw/main/music/Hop.mp3',
	musicLrc: '[00.00.00]本歌内容相对劲爆[00:00.26]Azis - Hop[00:01.24]Lover lover[00:06.97]F**ker f**ker[00:11.31]Lover[00:35.43]Мило обичаш ли ме още[00:38.51]Бейби събличаш ли ме нощем[00:41.48]Карай бавно няма да бързаш[00:44.30]Как ще стане много мърдаш[00:46.90]Хоп и влиза малко по малко[00:49.73]Хоп движи се бавно и бавно[00:52.57]Хоп и вкарай го точно сега[00:55.39]Ритъма на любовта[00:58.28]Хоп и влиза малко по малко[01:01.09]Хоп движи се бавно и бавно[01:03.94]Хоп и вкарай го точно сега[01:06.88]Ритъма на любовта[01:09.87]Lover f**ker[01:15.49]F**ker lover[01:21.18]Love me love me now[01:22.28]Love me love me now[01:24.06]Love me love me now[01:26.89]Mother mother mother[01:29.71]Love me love me now[01:31.20]Mother[01:32.93]Гледай без да се ядосваш[01:35.69]Пипай без да се докосваш[01:38.59]Недей да свършваш точно сега[01:41.41]Задръж се малко да да така[01:44.28]Хоп и влиза малко по малко[01:46.88]Хоп движи се бавно и бавно[01:49.67]Хоп и вкарай го точно сега[01:52.58]Ритъма на любовта[01:55.42]Хоп и влиза малко по малко[01:58.25]Хоп движи се бавно и бавно[02:01.10]Хоп и вкарай го точно сега[02:04.09]Ритъма на любовта[02:06.94]Хоп xоп xоп[02:18.39]Хоп xоп xоп[02:41.20]Хоп и влиза малко по малко[02:43.95]Хоп движи се бавно и бавно[02:46.81]Хоп и вкарай го точно сега[02:49.64]Ритъма на любовта[02:52.52]Хоп и влиза малко по малко[02:55.35]Хоп движи се бавно и бавно[02:58.23]Хоп и вкарай го точно сега[03:01.09]Ритъма на любовта[03:03.91]Хоп'
},{
	musicSinger: '阴阳怪气男团', 
	musicName: 'Summer Boy', 
	musicSrc: 'https://gong-cx.coding.net/p/my_file/d/currency/git/raw/main/music/summer_boy.mp3',
	musicLrc: '[00:00.000] 作词 : 法老/中国BOY/花少北/LexBurner/老番茄/某幻君[00:00.310] 作曲 : 法老/中国BOY/花少北/LexBurner/老番茄/某幻君[00:00.621]编曲：杨秋儒[00:13.305]合：[00:14.721]啦啦啦[00:16.454]我们都是summer boy[00:18.221]啦啦啦[00:20.121]我们靠在海边睡[00:22.004]wu～[00:23.805]连海螺都回应我 ay[00:25.671]wu～[00:27.121]但是你却不理我 ay[00:29.821]啦啦啦[00:31.304]我们都是summer boy[00:33.148]啦啦啦[00:35.038]我的朋友是海⻳[00:36.805]wu～[00:38.588]连⼭谷都回应我[00:40.571]wu～[00:42.138]但是你却不理我 ay[00:43.888]中国boy：[00:43.988]Summer day 怎么能少得了你[00:46.221]炎炎的夏日 期待你的美丽[00:48.138]没有了你的Summer day[00:49.854]我不堪⼀击[00:51.821]这个Summer需要⼀点爱情 oh[00:53.605]看到你后暴⻛⾬会骤停 oh[00:55.438]天⽓变晴牵着你⼿[00:57.354]⾛到了海边尽头[00:59.238]美⼈⻥和我挥⼿[01:01.054]烟花照亮了星空[01:02.905]看⻅你的笑容[01:04.787]我感觉很轻松[01:06.659]我是船⻓ Hans Wang[01:08.537]带你冲浪去远航[01:10.354]海浪晶莹透着光[01:12.221]寻找我们的宝藏[01:13.897]花少北：[01:14.111]夏⽇的微⻛吹进了⼼中[01:15.983]听着歌⼼情很轻松[01:17.878]汽⽔声砰砰 跳⽔声咚咚遇⻅她⾎量通通[01:21.578]清空 冰封[01:22.962]夏⽇变成了寒冬[01:24.727]寒⻛让房间逐渐通透[01:27.061]变成了皇宫[01:28.985]冰淇淋当饭 空调也拉满[01:30.878]电费贵的能让物业吓破胆[01:32.762]想要让我出⻔根本不可能[01:34.628]我要在家呆到外⾯没有楞[01:36.444]家中温度低到已经结冰[01:38.311]冰到甚⾄能够冻结你的⼼[01:40.144]朋友都说我的歌词⼟[01:42.010]看过以后像是中了暑[01:43.762]合：[01:43.878]啦啦啦[01:45.711]我们都是summer boy[01:47.528]啦啦啦[01:49.467]我们靠在海边睡  wu～[01:52.665]连海螺都回应我 ay wu～[01:56.415]但是你却不理我 ay[01:58.899]啦啦啦[02:00.632]我们都是summer boy[02:02.498]啦啦啦[02:04.366]我的朋友是海⻳  wu～[02:07.581]连⼭⾕都回应我  wu～[02:11.264]但是你却不理我 ay[02:13.649]Lex：[02:14.085]好热 为什么⼤家都出⻔玩乐[02:17.365]宅着 吹空调吃冰棍它不⾹吗[02:21.115]爽的 ⼜凉快⼜舒服还不会饿[02:24.748]我呢 理想是葛优躺每时每刻[02:28.500]⼈前扮酷 备受瞩⽬[02:30.435]不如冷⽓加厚被褥[02:32.299]⽼头衫 沙滩裤[02:34.200]乐趣⽆需再去赘述[02:36.049]合不合群我不在乎[02:37.866]因为这是我⼈⽣态度主宰⾃⼰前进道路[02:41.583]没有没有谁能谁能将我禁锢[02:43.133]⽼番茄：[02:43.846]Ay  漫步在黔灵⼭脚下[02:45.212]迎⾯却吹来了⻘岛的海⻛[02:47.193]Ay 渡过了秦淮河⼀抬头[02:49.002]却看⻅避暑⼭庄的柏松[02:50.801]这夏夜的蝉 谱着柔声的曲[02:52.535]想邀你共舞[02:54.561]⼤朵的浪花 将沙滩脚印[02:56.428]送给⽔⺟[02:58.228]穿过柏油⻢路[02:59.211]感觉⾃⼰身处⻢尔代夫[03:00.194]屁股下是沙发还是沙滩压根就不在乎[03:01.998]跳进浴缸我也可以[03:02.961]浮潜[03:04.127]宅在家里也⽤防晒[03:05.248]糊脸[03:05.828]What！What！What！[03:06.244]What a Summer Day！[03:06.828]I got tanned but ain’t afraid of ultraviolet ray[03:09.444]⼩卖部的冰棒 夜空⾥的星象[03:11.294]多少懵懂感情藏在少男少⼥⼼上[03:13.144]合：[03:13.561]啦啦啦[03:15.027]我们都是summer boy[03:16.894]啦啦啦[03:18.727]我们靠在海边睡[03:20.593]wu～[03:21.978]连海螺都回应我 ay[03:24.311]wu～[03:25.661]但是你却不理我 ay[03:28.193]啦啦啦[03:29.877]我们都是summer boy[03:31.728]啦啦啦[03:33.644]我的朋友是海⻳[03:35.478]wu～[03:36.860]连⼭⾕都回应我[03:39.178]wu～[03:40.595]但是你却不理我 ay[03:42.319]某幻君：[03:43.037]我在summer吃着ice cream[03:44.319]（my dream）[03:44.819]踏着beach 喝着cold drink[03:45.919]（够劲）[03:46.586]Ladies都在taking a break ya[03:47.937]⼀饮⽽尽 夏天滋味 ya[03:50.370]海浪的声⾳ 波涛的旋律[03:52.187]摆荡的⾹槟 我们还年轻[03:54.086]带着你来到我举办的party[03:55.919]去弹奏我刚买的尤克⾥⾥[03:57.853]欢度这夏天 抑制不住⼼情我拿出了酒精[04:01.537]抛弃了腼腆 管它的卡路⾥我喝的要加冰[04:05.020]we gonna do 桑巴就在今天[04:06.169]you better dance 抓紧时间[04:08.503]hold me tight baby[04:09.753]就在这个夏日⾥[04:10.520]with me ⼀起嗨个喜地欢天[04:12.336]合：[04:12.738]啦啦啦[04:14.586]我们都是summer boy[04:16.353]啦啦啦[04:18.321]我们靠在海边睡[04:20.120]wu～[04:21.536]连海螺都回应我 ay[04:23.853]wu～[04:25.238]但是你却不理我 ay[04:27.536]啦啦啦[04:29.452]我们都是summer boy[04:31.319]啦啦啦[04:33.153]我的朋友是海⻳[04:35.019]wu～[04:36.387]连⼭谷都回应我[04:38.769]wu～[04:40.120]但是你却不理我 ay[04:42.973]混音／母带：杨秋儒'
}];
var player = new Player(musicArr);
player.init();