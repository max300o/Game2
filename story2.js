/**
 * ============================================================
 *  The Fall of Angels Case File
 *  story.js  –  Complete Game Logic, Story Data & State Manager
 * ============================================================
 *
 *  Hidden Personality Parameters (never shown during gameplay):
 *    justice    – belief in the system / rule of law
 *    empathy    – emotional connection to victims and others
 *    pragmatism – willingness to bend rules for results
 *    doubt      – moral uncertainty / self-questioning
 *    resolve    – determination to see things through
 *
 *  Theme Switching:
 *    Call Game.setTheme('retro')  → adds class "theme-retro"  to <body>
 *    Call Game.setTheme('noir')   → adds class "theme-noir"   to <body>
 *    The CSS file handles all visual differences per class.
 *
 *  Save / Load:
 *    Automatic via localStorage key "fallen_angels_save".
 *    Reset button calls Game.reset().
 * ============================================================
 */

'use strict';

// ─────────────────────────────────────────────
//  STORY DATA
//  Each scene:
//    id          – unique string key
//    text        – exact narrative / dialogue text (array of strings, joined with \n)
//    choices     – array of { label, next, params? }
//                  params: object of { paramName: delta } applied on selection
//    isEnding    – (optional) true → triggers showEnding()
// ─────────────────────────────────────────────
const STORY_EN = {

  // ══════════════════════════════════════════
  //  OPENING
  // ══════════════════════════════════════════
  intro: {
    id: 'intro',
    text: [
      'The Fall of Angels Case File',
      '',
      'City: Fremant',
      'It\'s a small, green, and forested town. A safe town with religious people who trust each other so much that house doors are never locked. Recently, two roads have been built near the town, making it more crowded than before.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'The Forest Near Town',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Blake: You\'re late. I\'ve been waiting for hours. Where are you?',
    ],
    choices: [
      {
        label: 'Had some personal stuff to deal with',
        next: 'forest_scene',
        params: { pragmatism: 1, doubt: 1 },
      },
      {
        label: 'Never mind that — just tell me what happened',
        next: 'forest_scene',
        params: { resolve: 2, justice: 1 },
      },
    ],
  },

  forest_scene: {
    id: 'forest_scene',
    text: [
      'Blake: Strangled body, bruises around the neck. Beaten badly, attacked in the most brutal way possible. Probably someone who knew them. Face is messed up.',
      'Looks like it was personal — revenge.',
    ],
    choices: [
      {
        label: 'You\'re probably right — this wasn\'t a stranger',
        next: 'forensics_1',
        params: { justice: 1, pragmatism: 1 },
      },
      {
        label: 'I\'m not sure. Feels like a psycho attack',
        next: 'forensics_1',
        params: { doubt: 2, empathy: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  FIRST FORENSICS
  // ══════════════════════════════════════════
  forensics_1: {
    id: 'forensics_1',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'A Few Hours Later – Forensics',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Doctor: ID is Lanie Marke, 20 years old. Been dead a few days. We didn\'t find much — just a few strands of hair, sent them to the lab. Don\'t hold your breath. No blood at the scene either. She was likely killed somewhere else.',
    ],
    choices: [
      {
        label: 'I should notify the family. They deserve to know',
        next: 'notify_family',
        params: { empathy: 3, justice: 1 },
      },
      {
        label: 'I should head to the crime scene — maybe I can find where she was actually killed',
        next: 'crime_scene_search',
        params: { pragmatism: 2, resolve: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  BRANCH A – NOTIFY FAMILY
  // ══════════════════════════════════════════
  notify_family: {
    id: 'notify_family',
    text: [
      'Blake: William, I think we found our killer. When I went to tell her husband, his behavior was really suspicious. He didn\'t seem surprised by the news, and he acted way too calm. His clothes were also way too formal for early morning, like he was headed to a funeral.',
      'We need to go back and talk to him again.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'matthew_house',
        params: { resolve: 1 },
      },
    ],
  },

  matthew_house: {
    id: 'matthew_house',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Lanie\'s House – With Her Husband Matthew',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'William: I\'m sorry for your loss. I know this isn\'t a good time. We\'re just doing our job. Can I ask why you never reported your wife missing? She was killed days ago, but we had no report of her disappearance.',
      '',
      'Matthew: We had a fight a few days ago. She got angry and left. Whenever she got upset, she\'d go stay with friends for a few days and then come back. I figured she was there, so I didn\'t look for her. Besides, she was the strongest woman I\'ve ever seen. I never thought anyone could hurt her. I still can\'t believe it.',
    ],
    choices: [
      {
        label: 'Can you tell me exactly where you were four days ago?',
        next: 'matthew_alibi',
        params: { justice: 2, pragmatism: 1 },
      },
      {
        label: 'I understand. I don\'t have any more questions right now, but please don\'t leave town for the time being.',
        next: 'matthew_gentle',
        params: { empathy: 2, doubt: 1 },
      },
    ],
  },

  matthew_alibi: {
    id: 'matthew_alibi',
    text: [
      'Matthew: I went to see a family counselor. I wanted to fix things between us. I was tired of our situation, and I thought maybe that would help. Then I went to a hotel and stayed the night. I didn\'t want to face Lanie.',
      'Dr. Vinson can confirm that.',
    ],
    choices: [
      {
        label: 'Thanks for your cooperation. Don\'t worry — everything will work out.',
        next: 'thomas_scene',
        params: { empathy: 1 },
      },
      {
        label: 'Please email me the hotel receipt and the medical exam. And please, do not leave town under any circumstances.',
        next: 'thomas_scene',
        params: { justice: 2, resolve: 1 },
      },
    ],
  },

  matthew_gentle: {
    id: 'matthew_gentle',
    text: [
      'Matthew lowers his head. A heavy silence fills the room.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'thomas_scene',
        params: {},
      },
    ],
  },

  // ══════════════════════════════════════════
  //  BRANCH B – CRIME SCENE SEARCH
  // ══════════════════════════════════════════
  crime_scene_search: {
    id: 'crime_scene_search',
    text: [
      'Blake: Hey William, searching here is useless. With all this mud and grass, even if there\'s something, we won\'t find it. But Lanie didn\'t have a car. This place is far from town. So the killer must have brought her here by car. That kid who found her — Thomas — I saw him drive off. I think we should question him.',
    ],
    choices: [
      {
        label: 'Let\'s continue questioning Thomas',
        next: 'thomas_scene',
        params: { resolve: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  THOMAS INTERROGATION
  // ══════════════════════════════════════════
  thomas_scene: {
    id: 'thomas_scene',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Interrogating Thomas at the Station',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Thomas: I was walking through the woods when I saw a small pile of branches. Something gold was glinting near it. I went closer to check, and I saw an eye staring back at me. I felt sick at first. After a while, I pulled myself together and moved the branches aside. It was a girl, clutching a crucifix tightly in her hand. Then I called you guys.',
    ],
    choices: [
      {
        label: 'You know I can read lies in your eyes, right?',
        next: 'thomas_pressure',
        params: { pragmatism: 2, empathy: -1 },
      },
      {
        label: 'If you\'re gonna feed me lies, you\'d better just shut up.',
        next: 'thomas_pressure',
        params: { pragmatism: 3, empathy: -2 },
      },
    ],
  },

  thomas_pressure: {
    id: 'thomas_pressure',
    text: [
      'Thomas: I really didn\'t do anything. You want proof? Fine. I had a witness with me when I found the body.',
    ],
    choices: [
      {
        label: 'Maybe he\'s your accomplice. If he wasn\'t, why didn\'t he wait for us to arrive?',
        next: 'thomas_weed',
        params: { doubt: 1, justice: 1 },
      },
      {
        label: 'I hope you\'re not taking me for an idiot — because if you are, it\'s gonna get really bad for you.',
        next: 'thomas_weed',
        params: { pragmatism: 2 },
      },
    ],
  },

  thomas_weed: {
    id: 'thomas_weed',
    text: [
      'Thomas: Me and my friend were just messing around, smoking a little weed. That\'s it. I recorded everything. I can show you. I swear, the only reason he left was so we wouldn\'t get caught with the marijuana.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Two Weeks After the First Murder',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Blake: The forensics report finally came in. One of the hairs found at the scene belongs to a guy with a record — Brian Alonvas.',
      '',
      'Blake: He\'s a cab driver. Probably picked up the victim in town. Lives in Savannah, downtown, with his wife and newborn. Has a record for theft and gang involvement. Last one was 10 years ago. Looks like he\'s back on the wrong track.',
    ],
    choices: [
      {
        label: 'Hair alone isn\'t enough. We need a confession.',
        next: 'brian_interrogation',
        params: { justice: 2, doubt: 1 },
      },
      {
        label: 'Lab results don\'t lie. It was probably him.',
        next: 'brian_interrogation',
        params: { pragmatism: 2, empathy: -1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  BRIAN INTERROGATION
  // ══════════════════════════════════════════
  brian_interrogation: {
    id: 'brian_interrogation',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Interrogating Brian Alonvas',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'William: You know we already have enough evidence to arrest you right now. We\'re just trying to help you avoid the death penalty.',
      '',
      'Brian: I swear I don\'t even know what you\'re talking about. I\'m clueless. I mind my own business. I\'m just a cab driver. How would I know what you want from me?',
    ],
    choices: [
      {
        label: 'I\'ve seen this act before. Just tell the truth, and everything will be fine.',
        next: 'brian_dna',
        params: { pragmatism: 1, empathy: 1 },
      },
      {
        label: 'We found your DNA at a murder scene two weeks ago.',
        next: 'brian_dna',
        params: { justice: 2 },
      },
    ],
  },

  brian_dna: {
    id: 'brian_dna',
    text: [
      'Brian: Look, I\'m just a driver. I go to work every day and come home at night. I haven\'t done anything wrong in a long time. You can check my dashcam, ask my wife, ask my neighbors. I haven\'t done anything.',
    ],
    choices: [
      {
        label: 'Interesting. But why do you think you\'re really here?',
        next: 'brian_wife_reveal',
        params: { pragmatism: 1, doubt: 1 },
      },
      {
        label: 'Your wife already told us everything. You should\'ve coordinated with her before lying.',
        next: 'brian_wife_reveal',
        params: { pragmatism: 3, empathy: -1 },
      },
    ],
  },

  brian_wife_reveal: {
    id: 'brian_wife_reveal',
    text: [
      'Brian: What do you mean she told you everything? I didn\'t do anything. I swear. You have to listen to me.',
      '',
      'Blake: I talked to your wife an hour ago. She told me you were out all night two weeks ago and didn\'t come home at all. She even said she found bloodstains on your clothes when she was washing them. Anything to say?',
      '',
      'Brian: Please. Can you just tell my wife I love her?',
    ],
    choices: [
      {
        label: 'I\'m sorry, I can\'t do that. It\'s against the law.',
        next: 'second_murder',
        params: { justice: 3, empathy: -1 },
      },
      {
        label: 'I\'ll think about it.',
        next: 'second_murder',
        params: { empathy: 3, doubt: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  SECOND MURDER
  // ══════════════════════════════════════════
  second_murder: {
    id: 'second_murder',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Two Weeks Later – A Body in an Abandoned Factory',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Doctor: The victim was killed in exactly the same way as the previous one — with a thick rope. This time, the killer used less physical violence. The bruising shows he strangled her multiple times, reviving her after each attempt before starting again. He also took the victim\'s clothes. We found nothing. The killer tried to clean the scene with water, which suggests the murder happened right there. The victim\'s identity is unknown. No one reported her missing. Maybe a tourist.',
    ],
    choices: [
      {
        label: 'If it\'s exactly like the previous murder, then maybe the previous suspect is innocent.',
        next: 'brian_dead',
        params: { doubt: 3, justice: 1, empathy: 2 },
      },
      {
        label: 'This isn\'t just a murder anymore. This is pure torture.',
        next: 'brian_dead',
        params: { resolve: 2, empathy: 1 },
      },
    ],
  },

  brian_dead: {
    id: 'brian_dead',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'The Day After the Second Murder – Central Detention Center',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '— Hey guard, we\'re here to see Brian Alonvas.',
      'Guard: Let me check… Oh. You\'re a little late. His cellmate attacked him two days ago and strangled him. We got there too late. Couldn\'t save him. Not that I\'m sad about it — he was just another dirty killer.',
      '',
      'Blake: William, we messed up. Didn\'t we?',
    ],
    choices: [
      {
        label: 'We just did our job. There\'s no going back.',
        next: 'brian_wife_confession',
        params: { pragmatism: 2, empathy: -2, doubt: 1 },
      },
      {
        label: 'We should\'ve listened to him more. Now, for Brian\'s sake, we have to catch the real killer.',
        next: 'brian_wife_confession',
        params: { empathy: 3, resolve: 3, doubt: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  WIFE CONFESSION
  // ══════════════════════════════════════════
  brian_wife_confession: {
    id: 'brian_wife_confession',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Police Station – Five Days After the Second Murder',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Brian\'s Wife: I need to confess something. I lied to you about Brian. I just wanted to get away from him. He was always watching me, never letting me go anywhere. Living with him was a daily mental torture, but he never understood that I\'m a human being. I don\'t really know — maybe it was because he loved me too much. I didn\'t want him to die, I just wanted him to understand how I\'ve felt all these years. I wanted him to finally get it.',
      'I came here because I don\'t want my child growing up in a town where everyone thinks his father is a murderer. I want the truth to come out.',
    ],
    choices: [
      {
        label: 'I understand, but you played the system and the police. I have no choice but to arrest you.',
        next: 'shooting_lawrence',
        params: { justice: 3, empathy: -1 },
      },
      {
        label: 'Just go home and forget all of this. Time will heal everything.',
        next: 'shooting_lawrence',
        params: { empathy: 3, pragmatism: 2, justice: -2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  SHOOTING IN LAWRENCE
  // ══════════════════════════════════════════
  shooting_lawrence: {
    id: 'shooting_lawrence',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Shooting in Lawrence District',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'A man runs into the station, out of breath.',
      '— Help! Someone just shot a woman and her kid on Lawrence Street!',
      '',
      '[ Shooting Scene – Lawrence District ]',
      '',
      'Blake: What the hell? I\'ve never seen anything like this. Blood everywhere. Paramedics said the mother was shielding the kid, but the bullets went through her and hit the child. Both died on the spot.',
      'I can\'t take this damn job anymore. I want out. Every day it gets harder and harder to keep going.',
    ],
    choices: [
      {
        label: 'If we quit, who\'s gonna do it? Someone has to make the sacrifice.',
        next: 'accept_shooting_case',
        params: { resolve: 3, justice: 1 },
      },
      {
        label: 'If you want to leave, I won\'t stop you. But first, help me catch this killer.',
        next: 'accept_shooting_case',
        params: { pragmatism: 2, resolve: 1 },
      },
    ],
  },

  accept_shooting_case: {
    id: 'accept_shooting_case',
    text: [
      'Blake: This has never happened in this town before. It must be that same bastard. He\'s playing with us. We have to take this case.',
    ],
    choices: [
      {
        label: 'Okay, but after a quick look, we need to get back to our own case.',
        next: 'witness_description',
        params: { resolve: 1, doubt: 1 },
      },
      {
        label: 'It\'s worth looking into. Take the case.',
        next: 'witness_description',
        params: { resolve: 2, justice: 1 },
      },
    ],
  },

  witness_description: {
    id: 'witness_description',
    text: [
      'Blake: A few witnesses saw the killer up close. Some kids playing in the park saw a man jump out of the bushes and run fast toward Stone Street. A little chubby. Wearing red. Probably the same guy we\'re looking for.',
    ],
    choices: [
      {
        label: 'Tell all units to start patrolling right now and check all the cameras.',
        next: 'patrol_result',
        params: { resolve: 2, justice: 1 },
      },
      {
        label: 'We have shell casings at the scene. We should check the gun and bullets. Maybe there are fingerprints.',
        next: 'bullet_result',
        params: { pragmatism: 2, doubt: 1 },
      },
    ],
  },

  patrol_result: {
    id: 'patrol_result',
    text: [
      'Blake: We searched every street leading to the park. Either we were too late, or his house is nearby.',
      '',
      'Blake: Damn it. He just vanished into thin air. We\'ve got nothing. The chief called a few minutes ago. Said reporters are gathering outside the station, looking for answers. William, we need to do something.',
    ],
    choices: [
      {
        label: 'We haven\'t checked the dashcams of passing cars yet. It\'s not too late. We can still catch him.',
        next: 'camera_chase',
        params: { resolve: 2, pragmatism: 1 },
      },
      {
        label: 'We should talk to the families. Maybe they know something.',
        next: 'robinson_house',
        params: { empathy: 2, resolve: 1 },
      },
    ],
  },

  bullet_result: {
    id: 'bullet_result',
    text: [
      'Forensics Report: The bullet is caliber 22. No individual fingerprints on the casing. But we ran tests. If we find the gun, we can match the fingerprints on the casing to it as evidence.',
      '',
      'Blake: Damn it. He just vanished into thin air. We\'ve got nothing. The chief called a few minutes ago. Said reporters are gathering outside the station, looking for answers. William, we need to do something.',
    ],
    choices: [
      {
        label: 'We haven\'t checked the dashcams of passing cars yet. It\'s not too late.',
        next: 'camera_chase',
        params: { resolve: 2, pragmatism: 1 },
      },
      {
        label: 'We should talk to the families. Maybe they know something.',
        next: 'robinson_house',
        params: { empathy: 2, resolve: 1 },
      },
    ],
  },

  camera_chase: {
    id: 'camera_chase',
    text: [
      'Blake: We put a notice in the newspaper. It worked. Someone called. Said they were driving past the park at that time and saw a man in red running away fast. His car has a dashcam. We need to go see him.',
      '',
      '[ Half an hour later – The Driver\'s House ]',
      '',
      'Blake: I talked to him. He said the guy was chubby, wearing red and blue jeans. What did you find on the dashcam?',
      'William: The dashcam is broken. Nothing was recorded. Lucky bastard.',
      'Blake: You sure?',
      '— But the driver said he just bought the dashcam. Damn it. We\'ll have to keep searching.',
    ],
    choices: [
      {
        label: 'Continue investigation',
        next: 'hospital_victim',
        params: { resolve: 1, doubt: 1 },
      },
    ],
  },

  robinson_house: {
    id: 'robinson_house',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'The Robinson Family Home',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '— I\'m so sorry for your loss. We really don\'t want to do this, but we have to ask you a few questions. Was there anyone who had a problem with you or your wife — anyone who might want to hurt you?',
      '',
      'Roger Robinson: My wife\'s killer is out there, and you\'re here. You think if I knew who did this, I\'d be sitting here? You people don\'t get it. We were just living our lives. I\'m a construction worker, I\'ve never even argued with anyone. Let alone done something that would make someone kill my family.',
      'My wife was a simple woman, loved by everyone. She gave her whole life to me and my daughter. My daughter, Sunny. Everyone called her Sunny because every day, when the sun came out, you could hear her voice all over the neighborhood. She was the most energetic girl I could have asked for.',
      'Please find him. I need to know why my family was chosen.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'hospital_victim',
        params: { empathy: 2, resolve: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  HOSPITAL – SURVIVING VICTIM
  // ══════════════════════════════════════════
  hospital_victim: {
    id: 'hospital_victim',
    text: [
      '[ The Chief of Police arrives ]',
      'Chief: Hello? Where are you guys? Get to the hospital right now. Immediately.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Villiera Hospital',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Doctor: A 32-year-old female tourist was attacked a few hours ago and managed to escape. There are bruises on her neck and body. He was trying to strangle her. She\'s not doing well right now — she\'s in shock. Unfortunately, I can\'t let you talk to her at the moment.',
    ],
    choices: [
      {
        label: 'Like it or not, we need to see her right now, Doctor.',
        next: 'victim_testimony',
        params: { pragmatism: 2, justice: 1 },
      },
      {
        label: 'We understand, Doctor. We\'ll wait. Let us know when we can see her.',
        next: 'victim_testimony',
        params: { empathy: 2, resolve: 1 },
      },
    ],
  },

  victim_testimony: {
    id: 'victim_testimony',
    text: [
      '— Can you tell us what happened?',
      '',
      'Victim: A man, maybe 33 years old, asked me to help him load his stuff into his car. His arm was in a cast. When I went toward the car, I don\'t remember anything after that. When I woke up, I was in a basement. I was there for a while, then the man came back. He was angry. He got behind me, put a rope around my neck, and started choking me. When I came to, no one was there. He probably thought I was dead. I managed to open the door, get out, and ask for help.',
      'Please catch him. If you don\'t, he\'ll come for me again.',
    ],
    choices: [
      {
        label: 'Rest now. Don\'t worry — we\'ll find him. Leave everything to us.',
        next: 'green_palm_arrest',
        params: { empathy: 2 },
      },
      {
        label: 'I know this is hard, but we need your help. Can you help us find his house?',
        next: 'green_palm_arrest',
        params: { resolve: 2, pragmatism: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  PAUL ARRESTED
  // ══════════════════════════════════════════
  green_palm_arrest: {
    id: 'green_palm_arrest',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Paul Rox was arrested at his home in Green Palm District.',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '[ Station – Interrogation Room ]',
      '',
      'William: We have a victim who says you abducted her and tried to kill her. Even your neighbors testified that she came out of your house screaming. Anything to say?',
      '',
      'Paul: Yeah. I want a lawyer. The number\'s in my wallet.',
    ],
    choices: [
      {
        label: 'If you confess, maybe we can get you a lighter sentence.',
        next: 'paul_silence',
        params: { pragmatism: 2, justice: 1 },
      },
      {
        label: 'You know this makes us even more suspicious of you, right?',
        next: 'paul_silence',
        params: { pragmatism: 1, doubt: 1 },
      },
    ],
  },

  paul_silence: {
    id: 'paul_silence',
    text: [
      'Paul: I love the silent game. I can stay silent as long as you want. Just call my lawyer.',
      '',
      'Blake: I\'m sure he\'s hiding something. He\'s probably behind the previous murders. We need a warrant to search his house and car.',
      '',
      '[ 8 hours later ]',
      '',
      'Blake: The judge finally signed the warrant. Time to search his house.',
      '',
      'Blake: What kind of house is this with this smell? I can barely breathe. The whole place is scrubbed with cleaning products. Everything is shining.',
    ],
    choices: [
      {
        label: 'He was trying to erase evidence. No way we\'ll find anything.',
        next: 'house_search_forensics',
        params: { doubt: 2 },
      },
      {
        label: 'He knew we were coming. But maybe there\'s still some evidence left.',
        next: 'house_search_trash',
        params: { resolve: 2, pragmatism: 1 },
      },
    ],
  },

  house_search_forensics: {
    id: 'house_search_forensics',
    text: [
      '[ An hour later ]',
      '',
      'Blake: No rope, no evidence that helps us.',
      '— Get forensics in here. He can\'t clean everything. There must be some trace of the victim.',
      '',
      'Forensics Report: All evidence was destroyed by cleaning products. We found a few strands of female hair and some blood, but the evidence is too damaged to be admissible.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'paul_transfer',
        params: { doubt: 1 },
      },
    ],
  },

  house_search_trash: {
    id: 'house_search_trash',
    text: [
      '[ An hour later ]',
      '',
      'Blake: No rope, no evidence that helps us.',
      '— We need to check the trash around his house. He didn\'t have time to take things far.',
      '',
      'William: The trash was collected by the city a few hours ago and taken to the dump. Even if there was something, finding it now is impossible.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'paul_transfer',
        params: { doubt: 1 },
      },
    ],
  },

  paul_transfer: {
    id: 'paul_transfer',
    text: [
      'Blake: There\'s nothing more we can do. We\'ll have to send him to court. We still have the victim\'s testimony and the neighbors\' statements. He can\'t get out of this one.',
    ],
    choices: [
      {
        label: 'Agreed. Transfer him to the detention center.',
        next: 'paul_released',
        params: { justice: 2 },
      },
      {
        label: 'Yeah, but I want to talk to him first.',
        next: 'paul_talk_then_transfer',
        params: { resolve: 1, empathy: 1 },
      },
    ],
  },

  paul_talk_then_transfer: {
    id: 'paul_talk_then_transfer',
    text: [
      'Blake: Did you talk to him? Did he say anything?',
      'William: No. He just stayed silent the whole time. He won\'t tell us anything.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'paul_released',
        params: {},
      },
    ],
  },

  // ══════════════════════════════════════════
  //  PAUL RELEASED
  // ══════════════════════════════════════════
  paul_released: {
    id: 'paul_released',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '22 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Blake: William, did you hear? That guy who attacked the tourist — they released him. The woman didn\'t show up to testify. We didn\'t have enough evidence. I heard his lawyer is one of those big-shot types. God knows what the judges are doing. I can still smell the stench of blood. I don\'t know how they let him go.',
      'I feel like crap right now. Wanna grab some coffee?',
    ],
    choices: [
      {
        label: 'Yeah, sure. I could use some too.',
        next: 'coffee_roger',
        params: { empathy: 1, doubt: 1 },
      },
      {
        label: 'Sorry, but you\'ll have to go alone. I need to re-examine the evidence. Maybe I missed something.',
        next: 'sara_missing_intro',
        params: { resolve: 3, pragmatism: 1 },
      },
    ],
  },

  coffee_roger: {
    id: 'coffee_roger',
    text: [
      'Blake: You know William, when I look back now, I feel like everything was great — but it wasn\'t really. It was always messed up. I\'m tired of this endless cycle. Of all this damn pain. It feels like it\'ll never end. I just want one day where my mind goes blank. Where these damn thoughts leave my head. Just silence.',
    ],
    choices: [
      {
        label: 'If you find a way, let me know. I really need it too.',
        next: 'roger_cafe',
        params: { empathy: 2, doubt: 1 },
      },
      {
        label: 'That\'s nostalgia for you. You\'ll look back on these days fondly later.',
        next: 'roger_cafe',
        params: { resolve: 1, pragmatism: 1 },
      },
    ],
  },

  roger_cafe: {
    id: 'roger_cafe',
    text: [
      '[ The café door opens. Roger Robinson walks in. ]',
      '',
      'Roger Robinson: Having a good time, are you? While my wife and child are dead and my life is no different from death. When nothing goes down my throat. Are you even human? How can you sit here having coffee when my family\'s killer is free and I\'m burning in hellfire?',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'sara_missing_intro',
        params: { empathy: 2, doubt: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  SARA MISSING
  // ══════════════════════════════════════════
  sara_missing_intro: {
    id: 'sara_missing_intro',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '8 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Police Chief: A little girl went missing last night. Her family says she\'s not the type to go anywhere without telling them. A long rope and a bullet casing were found in her room.',
      'Green Street, 11. Get there now.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Green Street – No. 11',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'William: Can you tell us exactly what happened last night?',
      '',
      'Sara\'s Mother: I usually wake up early every morning to prepare Sara\'s lunch for school. When I went to wake her up for school, she wasn\'t there. There\'s no way she went out alone. She\'s not that kind of girl. Something must have happened.',
    ],
    choices: [
      {
        label: 'I understand. Officers are already looking for her right now.',
        next: 'sara_rope_question',
        params: { empathy: 2 },
      },
      {
        label: 'We need more information. Please try to think harder.',
        next: 'sara_mother_detail',
        params: { resolve: 1, justice: 1 },
      },
    ],
  },

  sara_mother_detail: {
    id: 'sara_mother_detail',
    text: [
      'Sara\'s Mother: I heard a noise last night. I wanted to check on Sara, but I was just too tired. A few moments later, I fell back asleep.',
      '— It\'s all my fault. If I weren\'t such a useless person, my daughter would…',
    ],
    choices: [
      {
        label: 'Everything will be okay. You don\'t need to worry.',
        next: 'sara_rope_question',
        params: { empathy: 2 },
      },
      {
        label: 'What about the rope? Was it in your house before?',
        next: 'sara_rope_answer',
        params: { resolve: 2, justice: 1 },
      },
    ],
  },

  sara_rope_answer: {
    id: 'sara_rope_answer',
    text: [
      'Sara\'s Mother: No. Never. This is the first time I\'m seeing it. Someone must have put it there.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'sara_press_conf',
        params: {},
      },
    ],
  },

  sara_rope_question: {
    id: 'sara_rope_question',
    text: [
      '— What should I do now?',
      '— We\'ll wait a few hours. If there\'s no news, we\'ll hold a press conference.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'sara_press_conf',
        params: {},
      },
    ],
  },

  sara_press_conf: {
    id: 'sara_press_conf',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '6 Hours After Sara\'s Disappearance – Press Conference',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Sara\'s Mother: I\'m Sara\'s mother. My child hasn\'t been seen since this morning. Please, if you see her anywhere, call the police immediately. And if someone has taken my daughter, please bring her back. She\'s the only light in our lives. Without her… I\'m sorry. I can\'t…',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Police Station – 11 Hours After Sara\'s Disappearance',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '[ A teenager walks into the station with a letter ]',
      '',
      '— Where do I hand this letter in?',
      'Officer Jackie: What is it?',
      '— Can\'t you see? It\'s a letter.',
      '— What kind of letter?',
      '— I don\'t know, really. Some guy gave me 300 bucks and told me to bring it here.',
      'Officer Jackie: Let me see it, kid. Sit down and don\'t move. Hey Melin, call the workshop. It\'s a letter from the kidnapper.',
    ],
    choices: [
      {
        label: 'Read the letter',
        next: 'letter_one',
        params: { resolve: 1 },
      },
    ],
  },

  letter_one: {
    id: 'letter_one',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Letter Text:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'I am the one who took Sara. When I heard her mother\'s cries, my hardened heart trembled. I remembered my own mother. She was the only one who ever cared about me — the only light in my life. Maybe everything started when she left, and I became what I am now.',
      'In a few days, I will turn myself in, accept my punishment, and return Sara to you. It\'s time to make amends for my mistakes. Please ask the families of my victims to forgive me. And please, release the rest of their families from the torment they\'ve been living in for years.',
      '',
      'Location: 33.11.696.11',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'The Location in the Letter:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Near the eastern highway\'s side road, the first victim was found — buried in a shallow grave. But that was only the first. After several hours of digging, three more bodies were found. Nothing but bones remained.',
      '',
      'Forensics Report: The bodies were buried a long time ago. We managed to identify one of them using dental records. Her family reported her missing 11 years ago. She was probably killed around that time. The other bodies were killed at different times. The killer was likely active for 11 years. The bodies were left in a heavily humid forest area. Animals and the environment destroyed everything. If we find anything, I\'ll let you know.',
    ],
    choices: [
      {
        label: 'Call me if you find anything, Doctor. This is really important.',
        next: 'daniel_boy',
        params: { resolve: 2, justice: 1 },
      },
      {
        label: 'Focus on finding their families, Doctor. They must have gone through some hard years. We owe it to them.',
        next: 'daniel_boy',
        params: { empathy: 3 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  DANIEL – THE MESSENGER BOY
  // ══════════════════════════════════════════
  daniel_boy: {
    id: 'daniel_boy',
    text: [
      'William: The killer said he\'d turn himself in, but I don\'t trust his word. Even if he does, we need hard evidence.',
      'That kid who brought the letter is our best chance to catch him.',
      '',
      '[ Station ]',
      '',
      'Blake: Hey kid, can you tell us where you got the letter?',
      '',
      'Daniel: I already told you. A guy in a mask gave me 300 bucks and told me to give the letter to the police. I didn\'t see his face — he had a mask on. All I know is he was white and around 30.',
    ],
    choices: [
      {
        label: 'If you saw him again, could you recognize him?',
        next: 'daniel_yes_recognise',
        params: { resolve: 1 },
      },
      {
        label: 'Can you give me any more details?',
        next: 'daniel_details',
        params: { pragmatism: 2 },
      },
    ],
  },

  daniel_yes_recognise: {
    id: 'daniel_yes_recognise',
    text: [
      'Daniel: Yeah. Even with a mask on, I could recognize him.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'daniel_gang_follow',
        params: {},
      },
    ],
  },

  daniel_details: {
    id: 'daniel_details',
    text: [
      'Daniel: He had thick eyebrows. His nose was a bit big. He kept scratching his nose. He was wearing a red shirt and blue jeans.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'daniel_gang_follow',
        params: {},
      },
    ],
  },

  daniel_gang_follow: {
    id: 'daniel_gang_follow',
    text: [
      'William: Alright. You can go for now. But don\'t leave town.',
      '',
      'William: Hey Blake, I know that kid. He\'s part of the White Ghost crew. They cause trouble in the back alleys every now and then. He might know the killer and is playing us. Follow him. Let me know everywhere he goes. Make sure he doesn\'t catch on.',
      'Here, drink this rum coffee. Don\'t take your eyes off him for a second.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'blake_shoots_daniel',
        params: { resolve: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  BLAKE SHOOTS DANIEL
  // ══════════════════════════════════════════
  blake_shoots_daniel: {
    id: 'blake_shoots_daniel',
    text: [
      '[ 6 hours later ]',
      '',
      'Blake: William! I need your help. Right now.',
      'William: Damn it. What happened here? I just told you to watch him. What the hell did you do?',
      'Blake: I don\'t remember anything. I just woke up next to him. That\'s it. I swear. I didn\'t do anything to him.',
      'William: Listen. He\'s just a kid, but he has a gun in his hand. You had to shoot him.',
      'Blake: I didn\'t shoot him. I don\'t know what happened. We need to tell the others.',
      'William: Blake, you don\'t know what you did. You just defended yourself. If the others get involved, the law might let you go, but your job and your life will be ruined. Even if the law forgives you, people won\'t. In their eyes, you\'re a child killer. This isn\'t the time to talk. Just get out of here. I\'ll handle the rest. Go home and take a few days off. That\'s all.',
      'Blake: But I can\'t. My head\'s not working. Help me. Please.',
    ],
    choices: [
      {
        label: 'You\'re just in shock. Everything\'s gonna be fine. Just get out of here.',
        next: 'blake_home',
        params: { pragmatism: 2, justice: -2 },
      },
      {
        label: 'Shut your mouth and do what I say. It\'s the only way.',
        next: 'blake_home',
        params: { pragmatism: 3, justice: -3, empathy: -1 },
      },
    ],
  },

  blake_home: {
    id: 'blake_home',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Three Days Later – Blake\'s House',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'William: How are you holding up? Were you able to deal with it? I really need you. The killer was supposed to turn Sara in, but he still hasn\'t. We need to search more.',
      '',
      'Blake: Have you ever looked in the mirror and not recognized yourself? I used to think that if I ever did something like that, I wouldn\'t be able to go on living. But now I feel nothing. I don\'t know what\'s wrong with me. I feel like that boy wasn\'t the only one who got shot — I was too. But inside my head. Because I don\'t remember anything, my mind is blank.',
    ],
    choices: [
      {
        label: 'Your mind is trying to help you. If it didn\'t, you\'d go insane.',
        next: 'sara_letter_two',
        params: { pragmatism: 1, doubt: 1 },
      },
      {
        label: 'Just keep doing what you\'re doing. You need to get back to work.',
        next: 'sara_letter_two',
        params: { resolve: 2, pragmatism: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  SARA FOUND DEAD – LETTER TWO
  // ══════════════════════════════════════════
  sara_letter_two: {
    id: 'sara_letter_two',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '19 Hours Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'The second letter arrived.',
      'Along with Sara\'s body, wrapped in a blanket with red flowers. A girl who had been stabbed eleven times.',
      'The murder likely took place on the same day Sara disappeared.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Letter Text:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'I\'m not even close to where I want to be.',
      'But I\'m far from where it all began.',
      'And that\'s enough to keep going.',
      'Heaven is right here, just without its people. I\'m building heaven.',
      'I said I\'d hand her over, and I did. A god never breaks a promise.',
    ],
    choices: [
      {
        label: 'Sara was dead from the very first day. We lost from the start.',
        next: 'blake_revenge',
        params: { doubt: 3, empathy: 2 },
      },
      {
        label: 'He was just playing games with Sara and her family. I doubt a piece of trash like that has a heart.',
        next: 'blake_revenge',
        params: { resolve: 2, empathy: 1 },
      },
    ],
  },

  blake_revenge: {
    id: 'blake_revenge',
    text: [
      'Blake: William, I don\'t want to arrest him anymore. I want him to die in the worst possible way. I\'m ready to face all the consequences. I have nothing left to lose. The rest is just absolute emptiness.',
    ],
    choices: [
      {
        label: 'I want him arrested. But I can\'t say I\'ll stand in your way.',
        next: 'chief_steps_down',
        params: { justice: 2, empathy: 1 },
      },
      {
        label: 'It\'s not worth it. He\'s going to die anyway. You can\'t kill a man twice.',
        next: 'chief_steps_down',
        params: { pragmatism: 2, doubt: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  CHIEF STEPS DOWN
  // ══════════════════════════════════════════
  chief_steps_down: {
    id: 'chief_steps_down',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '2 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Chief: After everything that\'s happened, the public and the media think the police are incompetent. But I know every single one of you has sacrificed so much. But the people only want results. They see you as heroes, not humans. So be a real hero for them.',
      'Me being here isn\'t doing anyone any good anymore. But my stepping down might help catch the killer — or at least calm the public down.',
      'William will be my replacement. He\'s the only one who can catch this killer.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'cemetery_murder',
        params: { resolve: 2, justice: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  CEMETERY MURDER
  // ══════════════════════════════════════════
  cemetery_murder: {
    id: 'cemetery_murder',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '4 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'The body of a 40-year-old woman is found in the town cemetery. The body was placed on top of a tombstone. Her hands were clasped together and laid on her stomach. She was wearing elegant, expensive clothes, and surrounded by flower petals.',
      '',
      'Blake: No stab wounds or gunshot marks on her body. She wasn\'t strangled. Did our killer change his method again?',
    ],
    choices: [
      {
        label: 'Wouldn\'t surprise me.',
        next: 'linsey_forensics',
        params: { resolve: 1 },
      },
      {
        label: 'It can\'t be him. This murder is too personal.',
        next: 'linsey_forensics',
        params: { doubt: 2, empathy: 1 },
      },
    ],
  },

  linsey_forensics: {
    id: 'linsey_forensics',
    text: [
      'Forensics:',
      '',
      'Doctor: The body belongs to Linsey Bankid. Single, living alone. She had sex before the murder, and we were able to find DNA. The test results will come soon. We found velvet fibers under her fingernails. The victim was hit on the head first, but it wasn\'t fatal. The actual cause of death was suffocation. The killer put her in a confined space. She fought to get out until the very end. All her nails were broken.',
    ],
    choices: [
      {
        label: 'Get the DNA report done faster and send it to me.',
        next: 'road_camera_check',
        params: { resolve: 2, justice: 1 },
      },
      {
        label: 'Look for connections between the murders. I need to know if it\'s him or not.',
        next: 'road_camera_check',
        params: { pragmatism: 2, doubt: 1 },
      },
    ],
  },

  road_camera_check: {
    id: 'road_camera_check',
    text: [
      'William: Blake, gather all units. Check every road camera. We need to look at every car that passed through. He won\'t slip away this time.',
      '',
      '[ Three hours later ]',
      '',
      'Blake: Hey chief, we found something. The day before the body was found, a car parks on the side of the road. He sits in the car for an hour, then gets out. He takes a suitcase out of the trunk and heads toward the cemetery. When he goes, the suitcase is heavy, but when he comes back, he carries it easily. I think we got him.',
    ],
    choices: [
      {
        label: 'Call the judge and get an arrest warrant. We need to move fast.',
        next: 'jonathan_arrest',
        params: { resolve: 3, justice: 2 },
      },
      {
        label: 'Investigate more. We can\'t make another mistake. When you\'re sure, arrest him.',
        next: 'jonathan_arrest',
        params: { doubt: 2, justice: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  JONATHAN ARREST
  // ══════════════════════════════════════════
  jonathan_arrest: {
    id: 'jonathan_arrest',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '2 Days Later – Jonathan Farin Arrested at the Airport',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '[ Interrogation Room ]',
      '',
      '— The DNA test results are in. And we found the suitcase she was suffocated in at your house. The question is — why did she have to die?',
      '',
      'Jonathan: Because she broke my favorite mug. You know, I lived with her for years. All that time, all she did was torment me. Humiliate me. She made everything I owned hers. There was no way out. Everything I had in life was hers now. Maybe it sounds stupid, but after years of putting up with it, you reach a point where even the smallest thing becomes a living hell.',
      'That day, we had a fight. She started throwing things at me. Then she threw my mug. I didn\'t even like that mug, but it was the only thing that was mine. I went to my room, grabbed my baseball bat, and hit her on the head. I thought she was dead. I put her in the suitcase. But she wasn\'t dead. She started calling out to me. She wanted me to let her out. If I\'m being honest, I didn\'t kill her — I just didn\'t help her. Just like she never helped me all those years.',
    ],
    choices: [
      {
        label: 'William, were the other murders in town also your doing?',
        next: 'jonathan_confession',
        params: { resolve: 2, justice: 2 },
      },
      {
        label: 'Do you regret what you did?',
        next: 'jonathan_no_regret',
        params: { empathy: 2, doubt: 1 },
      },
    ],
  },

  jonathan_confession: {
    id: 'jonathan_confession',
    text: [
      'Jonathan: No. But if you\'d like, I can confess to them. I\'m going to die anyway.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'wanda_murder',
        params: { justice: 1 },
      },
    ],
  },

  jonathan_no_regret: {
    id: 'jonathan_no_regret',
    text: [
      'Jonathan: She never regretted anything until the very end. So why should I?',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'wanda_murder',
        params: { doubt: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  WANDA MURDER – PLANTED EVIDENCE
  // ══════════════════════════════════════════
  wanda_murder: {
    id: 'wanda_murder',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '3 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Blake: We have a new victim. Wanda Saida. Her parents found her in the backyard. Strangled. Stabbed eleven times. Her face burned with acid. The main issue is that Wanda wasn\'t supposed to be near home — she\'s studying in Marytown, and witnesses say she was at the university just hours before the murder.',
      '',
      'William: Were we able to find any evidence?',
      'Blake: No. The body was completely washed. But we found a few strands of hair.',
      'William: That\'s great. What are the lab results?',
      'Blake: I\'ve been thinking about this for a while. My guess is probably correct. The killer is planting evidence. The hair we found belongs to an inmate who was in prison at the time of the murder. Like Brian — he was innocent. The killer doesn\'t leave evidence unless it\'s fake.',
    ],
    choices: [
      {
        label: 'We can\'t let him play us. Check all the evidence, even if it\'s fake.',
        next: 'shooting_child',
        params: { resolve: 2, justice: 1, doubt: 1 },
      },
      {
        label: 'Check if there\'s any common link between the people whose hair we found.',
        next: 'shooting_child',
        params: { pragmatism: 2, resolve: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  CHILD SHOT
  // ══════════════════════════════════════════
  shooting_child: {
    id: 'shooting_child',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '11 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      '— Hello? I want to report a shooting. Harrison Street, west side. Someone shot a kid. You need to get here. He\'s bleeding.',
      '',
      'Blake: You know William, the people of this town have put too much hope in us. We\'re never going to catch this killer. If they had asked the killer for help, maybe they\'d have gotten results sooner. We\'re supposed to save people, but we\'re not actually doing anything.',
      'William: It\'s over. Please. There was no way to save him. He was gone before we and the ambulance arrived. But we have a witness. It\'s not too late to fix things.',
    ],
    choices: [
      {
        label: 'Continue – Listen to the witness testimony',
        next: 'child_witness',
        params: { resolve: 2, empathy: 1 },
      },
    ],
  },

  child_witness: {
    id: 'child_witness',
    text: [
      'Witness: Me and Jimmy were walking home from school. A man came up to us and offered us a few bucks to help him move some boxes. I wanted to say yes, but Jimmy said we had to go. Suddenly the guy turned around and asked how old we were. I said 9, Jimmy said 11. And he pulled out a gun and started shooting. The sound is still in my head. He fired 11 shots. And he counted every single bullet. I can still recognize his voice.',
    ],
    choices: [
      {
        label: 'Do you remember anything about his face or clothes?',
        next: 'witness_clothes',
        params: { resolve: 2 },
      },
      {
        label: 'How old was Jimmy really?',
        next: 'witness_jimmy_age',
        params: { empathy: 2 },
      },
    ],
  },

  witness_clothes: {
    id: 'witness_clothes',
    text: [
      'Witness: Red shirt, blue pants, white shoes. Black hair. Some beard hair was sticking out from under his mask.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'roger_suicide',
        params: { resolve: 1 },
      },
    ],
  },

  witness_jimmy_age: {
    id: 'witness_jimmy_age',
    text: [
      'Witness: 9 years old. He was my classmate. He used to say he was 11 so he\'d seem older.',
    ],
    choices: [
      {
        label: 'Continue',
        next: 'roger_suicide',
        params: { empathy: 2, doubt: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  ROGER SUICIDE
  // ══════════════════════════════════════════
  roger_suicide: {
    id: 'roger_suicide',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '3 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Blake: Roger Robinson committed suicide. Jumped out of his window.',
      '',
      'William: How are you feeling?',
      '',
      'Blake: Does it matter? To be honest, I\'m fine. I\'m used to it now. If they\'re gonna die tomorrow, why not today? If they\'re guilty, they go to heaven. If they\'re not, they go to hell. That\'s the path everyone has to take. There\'s no escaping it.',
    ],
    choices: [
      {
        label: 'I know religion is your escape from pain, but this isn\'t the path you should take.',
        next: 'eleven_number',
        params: { empathy: 2, resolve: 1 },
      },
      {
        label: 'I hope all the victims were good people. They deserve some redemption.',
        next: 'eleven_number',
        params: { empathy: 3, doubt: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  THE NUMBER ELEVEN
  // ══════════════════════════════════════════
  eleven_number: {
    id: 'eleven_number',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '2 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Blake: I think we were blind. The killer was always right in front of us, but we didn\'t see him. I reviewed the case file. The number eleven is repeated throughout the entire case. That\'s the killer\'s signature. The only clue that might lead us to him.',
      '',
      'William: What does it mean? Some specific number for the killer?',
      '',
      'Blake: Eleven is only divisible by itself. It represents self-righteousness and pride. It\'s a symbol of genius, intuition, and foresight. It\'s basically the line between prophecy and madness.',
      '',
      'William: You said it\'s repeated throughout the case. Like where?',
      '',
      'Blake: We thought the victims were chosen at random, but that\'s not the case. He killed Sara just because her house number was 11. Or Jimmy because of his age.',
    ],
    choices: [
      {
        label: 'This number doesn\'t help us. It\'s just a dead end.',
        next: 'bar_paul_caught',
        params: { doubt: 2 },
      },
      {
        label: 'Get help from the team. Let\'s see what we can figure out about it.',
        next: 'bar_paul_caught',
        params: { resolve: 3, pragmatism: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  BAR – PAUL CAUGHT AGAIN
  // ══════════════════════════════════════════
  bar_paul_caught: {
    id: 'bar_paul_caught',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '7 Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'William: Hey Blake, we have a report of a disturbance at the Ventham bar. Someone was trying to strangle a woman. Get over there and see what\'s going on.',
      '',
      '[ An hour later ]',
      '',
      'Blake: We arrested him. It\'s the same Paul — the one who attacked the tourist and was released by the court. He went into the bar at 11 and started beating the bartender, then tried to strangle her with a rope. But someone stepped in and stopped him. I think this is our killer. Everything fits — the rope and the number eleven.',
      'William, now\'s a good time to search his house. He didn\'t have time to clean it up. Go find me some evidence. Real evidence.',
    ],
    choices: [
      {
        label: 'Continue – Search Paul\'s house',
        next: 'paul_house_search',
        params: { resolve: 2 },
      },
    ],
  },

  paul_house_search: {
    id: 'paul_house_search',
    text: [
      '[ Three hours later ]',
      '',
      'He knew he was going to be arrested. He\'d cleaned the entire house. I even searched his parents\' house and his car. I found nothing. Except for what he left for us — a bullet and a rope. Exactly like Sara\'s room. There are bloodstains and tiny pieces of skin on the rope. Probably from the victim.',
    ],
    choices: [
      {
        label: 'With this evidence, we won\'t get anywhere.',
        next: 'mary_tourist_found',
        params: { doubt: 2 },
      },
      {
        label: 'He\'s escaped once. If we mess up again, he\'ll get away again.',
        next: 'mary_tourist_found',
        params: { justice: 2, resolve: 1 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  MARY – THE TOURIST
  // ══════════════════════════════════════════
  mary_tourist_found: {
    id: 'mary_tourist_found',
    text: [
      'William: Find the only survivor — the female tourist. She\'s our only hope.',
      '',
      '[ A few hours later ]',
      '',
      'Blake: I finally found her. Her name is Mary Blast. After checking, I found out she was arrested in a neighboring town for trying to strangle a woman, but the woman fought back and managed to escape.',
      'William: So she might be Paul\'s accomplice? Or another victim?',
      'Blake: Anything\'s possible in this case. I told them to get her ready. We need to go now.',
    ],
    choices: [
      {
        label: 'Continue – Interrogate Mary',
        next: 'mary_interrogation',
        params: { resolve: 2 },
      },
    ],
  },

  mary_interrogation: {
    id: 'mary_interrogation',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Interrogation Room',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'William: You\'re connected to the murders in Fremant, aren\'t you? What\'s your connection to Paul? We\'ve got him in custody. You have nowhere to run.',
      '',
      'Mary: Eleven months ago, I saw a job ad in your town. Good pay and benefits. Everything I wanted. So I came to Fremant. The person who placed the ad was Paul. He was supposed to take me to work. But I found myself in his basement — an empty room with just a bed and a wall clock. I screamed for hours, but no one came. Until the clock chimed. At 11, Paul came down. He wanted to have sex with me. When I resisted, he beat me until I passed out.',
      'When I came to, he said: "Do you know why you\'re here? You committed a great sin. I want to set you free, but first you must confess your sin."',
      'Every night for eleven months, he came at the same time and did whatever he wanted. And I confessed all my secrets and all the sins I\'d ever committed. Even stealing a lollipop as a kid. I was always looking for a reason why I was being punished.',
      'Eleven months of imprisonment had passed. I had no hope of getting out. I just wanted to die. I always knew punishment was coming and when it would arrive. But I couldn\'t stop it.',
      'Finally, one day before my release, Paul came with a girl. She was unconscious. Paul told me she was your replacement — you\'re no longer useful to me. And tomorrow you\'re going to die. Paul left, and I was alone with the girl.',
      'The girl was there. She didn\'t move. Just breathed softly. I stared at her for hours. Her face was beautiful — exactly like an angel. I was looking for an answer. Who has the right to live? Me or her?',
      'The answer wasn\'t hard at all. I put my hands around her neck and started choking her. I did it several times. I had to make sure she was dead.',
      'Paul came back at 11. He was smiling. He asked me: "What sin did you commit to be worthy of being here?"',
      'I said: Murder.',
      'He said I was free. But I had to do something for him.',
      'You\'re good actors, but the story was already written. You said you arrested him? He\'s just putting on a show. You just keep circling around the center and you\'ll never get close.',
      'He called me again recently. Said I had to kill someone else in the same way so he could keep playing the police. I had to do what he asked. But I failed. This is your only chance.',
    ],
    choices: [
      {
        label: 'I feel for you, but I can\'t save you.',
        next: 'paul_trial',
        params: { justice: 3, empathy: -1 },
      },
      {
        label: 'Will you testify against him in court?',
        next: 'paul_trial',
        params: { justice: 2, empathy: 2, resolve: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  TRIAL
  // ══════════════════════════════════════════
  paul_trial: {
    id: 'paul_trial',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '3 Months Later – Paul\'s Trial',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Judge: After hearing the witness\'s testimony, do you still claim to be God?',
      '',
      'Paul: You know, if you started cursing God right now in this courtroom, he couldn\'t kill you. But I can. Now, who\'s your God?',
      '',
      '[ The courtroom falls silent. ]',
      '',
      'Paul: You know you can\'t kill God with a bullet. There\'s only one way to kill God — erase him from people\'s minds. I killed God with my murders to set you free. In this town, no one believes in God anymore. They believe in me more than they believe in him. My courtroom is fuller than any church.',
      '',
      '[ Paul turns to the jury, smiling, and starts counting. ]',
      'One. Two. Three…….Eleven.',
      'When he finished counting, he said: "God gave you 10 commandments, and I gave you 11. God tormented you with life, and I give you peace with death."',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'First Psychologist:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'I counsel many people every day, and I guarantee that Paul is insane in every sense. He spent eleven full years committing eleven murders to break God\'s ten commandments. Murder, theft, assault, and more. He deeply believes he\'s a savior born to rescue people. He sees God as the source of pain. He mentions a mother in his letters, but he never had one — which points to antisocial personality disorder with an extremely high level of manipulation. He not only lacks empathy, but he understands that others have it and exploits that weakness. This level of coldness is rare even among serial killers.',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Second Psychologist:',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'The defendant is not only sane but highly intelligent. He knew what he was doing was wrong, which is why he tried to destroy evidence. He surrendered to the police twice just to toy with them and show off by escaping. If it weren\'t for the witness, he probably would have gotten away again. In his first letter, he mocks the police, showing his dangerously controlling nature.',
      '',
      'Judge: Thank you for your insights. It\'s time to give the jury time to reach their final decision, which will be announced at the next hearing.',
    ],
    choices: [
      {
        label: 'Continue – Jury verdict',
        next: 'verdict',
        params: { resolve: 1 },
      },
    ],
  },

  verdict: {
    id: 'verdict',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'Two Days Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Jury Representative: Based on witness testimony and the evidence presented, the entire jury finds the defendant, Paul, guilty of 11 counts of murder, kidnapping, assault, and psychological and physical torture. His insanity plea is deemed false and fabricated. We sentence him to death.',
      '',
      'Blake: It\'s finally over. He got what he deserved.',
    ],
    choices: [
      {
        label: 'Death isn\'t a punishment for him — it\'s a reward. He did everything he wanted before they caught him.',
        next: 'book_eleven',
        params: { doubt: 3, empathy: 2, justice: -1 },
      },
      {
        label: 'He\'s still alive. Nothing\'s fixed until he\'s dead.',
        next: 'book_eleven',
        params: { resolve: 2, justice: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  THE BOOK
  // ══════════════════════════════════════════
  book_eleven: {
    id: 'book_eleven',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '8 Months Later',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Blake: Hey chief, a letter arrived for you. From the prison. From Paul.',
      'William: Don\'t open it. Maybe it\'s a bomb. Wouldn\'t be surprised from a psycho like him. Better have Jackie open it. He\'s not that important anyway.',
      'Blake: Forget it. I\'ll open it myself. He sent you a book. His own book. "The Book of Eleven."',
      '',
      'William: I\'ve heard about it. People are lining up to buy it. He was right — he became a god. His book is selling more than the Bible. Monsters are remembered more than victims in this world. In this world, people are either wolves or sheep. If you\'re a sheep, you\'re destined to be devoured. And people know this instinctively. So they want to be like a wolf. A real wolf.',
      '',
      'Blake: On the first page, he wrote to you: "To William. My final commandment is this — never run from who you are."',
    ],
    choices: [
      {
        label: 'Burn it. I don\'t want to hear anything about that man.',
        next: 'ending_burn',
        params: { justice: 2, empathy: 1 },
      },
      {
        label: 'I\'ll keep it. A good souvenir from a monster.',
        next: 'prison_visit',
        params: { pragmatism: 2, doubt: 2 },
      },
    ],
  },

  // ══════════════════════════════════════════
  //  ENDING A – BURN THE BOOK
  // ══════════════════════════════════════════
  ending_burn: {
    id: 'ending_burn',
    text: [
      'The book burns.',
      '',
      'The End.',
    ],
    choices: [],
    isEnding: true,
  },

  // ══════════════════════════════════════════
  //  ENDING B – PRISON VISIT
  // ══════════════════════════════════════════
  prison_visit: {
    id: 'prison_visit',
    text: [
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '16 Years Later – Central Prison',
      'Two Days Before Paul\'s Execution',
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      '',
      'Paul: I didn\'t think I\'d see you again. I thought you\'d be more cautious than to come here.',
      '',
      'William: You\'re going to die soon. Dead men can\'t talk.',
      '',
      'Paul: How\'s your friend? Still alive?',
      '',
      'William: Of course. Why wouldn\'t he be?',
      '',
      'Paul: I thought you would\'ve killed him by now.',
      '',
      'William: After I killed Daniel, he\'s been watching my back out of fear that I\'d slip up.',
      '',
      'Paul: What makes you think I won\'t tell them everything about you at the last moment?',
      '',
      'William: Because every god needs an heir on earth.',
    ],
    choices: [],
    isEnding: true,
  },
};

// ─────────────────────────────────────────────
//  PERSONALITY PROFILES
//  Evaluated from final param totals at end-game
// ─────────────────────────────────────────────
const PROFILES = [
  {
    // High justice + high resolve → The Idealist Detective
    id: 'idealist',
    label: 'Idealist Detective',
    condition: (p) => p.justice >= 10 && p.resolve >= 8,
    text: `You believe in the law as the only shield between order and chaos. Even when the system failed and innocent people like Brian died, you never strayed from the path. That consistency is admirable — but sometimes blind. You fight for what should be, not always for what is.`,
  },
  {
    // High empathy + high doubt → The Broken Witness
    id: 'broken',
    label: 'Broken Witness',
    condition: (p) => p.empathy >= 12 && p.doubt >= 10,
    text: `Each victim took a piece of you with them. You saw the system fail, you saw the innocent die, and yet you still felt — maybe deeper than anyone around you. That sensitivity is both your strength and your wound. You're defined not by the victory, but by the ones you lost.`,
  },
  {
    // High pragmatism + low justice → The Ends Justify
    id: 'pragmatist',
    label: 'Lawless Man',
    condition: (p) => p.pragmatism >= 10 && p.justice <= 4,
    text: `For you, the result always trumps the method. You knew what William did was wrong — but you kept going. Maybe for Blake, maybe for the case, maybe because you never truly believed in what you were sacrificing. In the end, you and Paul are not so different.`,
  },
  {
    // High resolve + high pragmatism → The Relentless
    id: 'relentless',
    label: 'Relentless',
    condition: (p) => p.resolve >= 12 && p.pragmatism >= 8,
    text: `You were a machine. You chased the murders, pulled the threads, and even when everything fell apart, you kept going. That resolve didn't save people like Roger Robinson — but it put Paul on death row. Sometimes victory is just a matter of holding on.`,
  },
  {
    // High empathy + high justice → The Guardian
    id: 'guardian',
    label: 'The Guardian',
    condition: (p) => p.empathy >= 10 && p.justice >= 8,
    text: `You took sides with the victims, not just with the case. You heard Mary's voice, you saw Roger Robinson's eyes, and it showed in your decisions. That humanity slowed you down — but it was that same humanity that made the difference.`,
  },
  {
    // Default → The Gray Detective
    id: 'gray',
    label: 'Gray Detective',
    condition: () => true,
    text: `You lived in the gray area. Not quite an idealist, not quite ruthless. Every choice took something and gave something. Fremant will never again be the safe town where doors were never locked — but Paul was executed. In this line of work, sometimes that's all that remains.`,
  },
];

// ─────────────────────────────────────────────
//  DEFAULT / INITIAL STATE
// ─────────────────────────────────────────────
const INITIAL_STATE = {
  currentScene: 'intro',
  params: {
    justice: 0,
    empathy: 0,
    pragmatism: 0,
    doubt: 0,
    resolve: 0,
  },
  history: [],        // list of visited scene IDs
  choicesMade: {},    // { sceneId: choiceIndex }
  theme: 'retro',
};

const SAVE_KEY = 'fallen_angels_save';

// ─────────────────────────────────────────────
//  GAME CLASS
// ─────────────────────────────────────────────
class Game {
  constructor() {
    this.state = null;
  }

  // ── THEME HANDLING (placeholder – CSS does the visual work) ──────────────
  setTheme(themeName) {
    // themeName: 'retro' | 'noir'
    document.body.classList.remove('theme-retro', 'theme-noir');
    document.body.classList.add(`theme-${themeName}`);
    if (this.state) {
      this.state.theme = themeName;
      this._save();
    }
  }

  // ── INITIALISE ───────────────────────────────────────────────────────────
  initGame() {
    const saved = this._load();
    if (saved) {
      this.state = saved;
    } else {
      this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    }
    this.setTheme(this.state.theme || 'retro');
    this.renderScene(this.state.currentScene);
  }

  // ── RESET ────────────────────────────────────────────────────────────────
  reset() {
    localStorage.removeItem(SAVE_KEY);
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.setTheme('retro');
    this.renderScene('intro');
  }

  // ── RENDER SCENE ─────────────────────────────────────────────────────────
  renderScene(sceneId) {
    const scene = STORY[sceneId];
    if (!scene) {
      console.error(`Scene not found: ${sceneId}`);
      return;
    }

    // Mark visited
    if (!this.state.history.includes(sceneId)) {
      this.state.history.push(sceneId);
    }
    this.state.currentScene = sceneId;
    this._save();

    // Check if ending
    if (scene.isEnding) {
      this.showEnding(scene);
      return;
    }

    // ── Build DOM output ──────────────────────────────────────────────────
    const container = document.getElementById('game-container');
    if (!container) {
      console.error('Element #game-container not found in DOM.');
      return;
    }

    // Narrative text
    const narrativeText = scene.text.join('\n');

    // Choices HTML
    const choicesHtml = scene.choices.length > 0
      ? scene.choices
          .map((choice, idx) =>
            `<button
               class="choice-btn"
               data-scene="${sceneId}"
               data-choice="${idx}"
               aria-label="Choice ${idx + 1}: ${choice.label}"
             >${choice.label}</button>`
          )
          .join('')
      : '<p class="no-choices">[ End of scene ]</p>';

    container.innerHTML = `
      <div class="scene" role="main" aria-live="polite">
        <pre class="narrative">${this._escapeHtml(narrativeText)}</pre>
        <div class="choices" role="group" aria-label="Choices">
          ${choicesHtml}
        </div>
      </div>
    `;

    // Attach choice listeners
    container.querySelectorAll('.choice-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const choiceIdx = parseInt(btn.dataset.choice, 10);
        this.makeChoice(sceneId, choiceIdx);
      });
    });

    // Scroll to top of container
    container.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── MAKE CHOICE ──────────────────────────────────────────────────────────
  makeChoice(sceneId, choiceIndex) {
    const scene = STORY[sceneId];
    if (!scene) return;

    const choice = scene.choices[choiceIndex];
    if (!choice) return;

    // Record choice
    this.state.choicesMade[sceneId] = choiceIndex;

    // Apply parameter deltas
    if (choice.params) {
      for (const [param, delta] of Object.entries(choice.params)) {
        if (this.state.params.hasOwnProperty(param)) {
          this.state.params[param] += delta;
        }
      }
    }

    // Persist then navigate
    this._save();
    this.renderScene(choice.next);
  }

  // ── SHOW ENDING ──────────────────────────────────────────────────────────
  showEnding(scene) {
    const p = this.state.params;

    // Find matching profile
    const profile = PROFILES.find((pr) => pr.condition(p)) || PROFILES[PROFILES.length - 1];

    // Final text from scene
    const sceneText = scene.text.join('\n');

    const container = document.getElementById('game-container');
    if (!container) return;

    container.innerHTML = `
      <div class="scene ending" role="main" aria-live="polite">
        <pre class="narrative">${this._escapeHtml(sceneText)}</pre>

        <div class="profile-card" aria-label="Personality Profile">
          <div class="profile-title">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div class="profile-title">William's Profile</div>
          <div class="profile-title">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div class="profile-label">${profile.label}</div>
          <div class="profile-text">${profile.text}</div>
        </div>

        <div class="choices">
          <button class="choice-btn restart-btn" id="restart-btn">
            Start Over
          </button>
        </div>
      </div>
    `;

    document.getElementById('restart-btn')?.addEventListener('click', () => {
      this.reset();
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── SAVE / LOAD ──────────────────────────────────────────────────────────
  _save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  _load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Basic validation
      if (!parsed.currentScene || !parsed.params) return null;
      return parsed;
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
      return null;
    }
  }

  // ── UTILITY ──────────────────────────────────────────────────────────────
  _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// ─────────────────────────────────────────────
//  BOOTSTRAP
// ─────────────────────────────────────────────
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  game.initGame();

  // Reset / Start Over button (optional element in HTML)
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure? All your progress will be lost.')) {
        game.reset();
      }
    });
  }

  // Theme toggle buttons (optional elements in HTML)
  const retroBtn = document.getElementById('theme-retro-btn');
  const noirBtn  = document.getElementById('theme-noir-btn');
  if (retroBtn) retroBtn.addEventListener('click', () => game.setTheme('retro'));
  if (noirBtn)  noirBtn.addEventListener('click',  () => game.setTheme('noir'));
});
