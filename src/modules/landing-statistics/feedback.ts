import type { LandingRecord } from '../../types/settings';

const qualityPools = {
  Butter: [
    "A flawless touchdown! Absolutely buttery smooth.",
    "Beautifully greased landing. A work of art!",
    "Stunning touchdown! Passengers barely felt the wheels kiss the tarmac."
  ],
  Silky: [
    "Extremely smooth landing. Silky transition from air to ground.",
    "Superb landing technique. Very gentle touchdown.",
    "Excellent greaser! That was beautifully managed."
  ],
  Great: [
    "Great landing! A solid, controlled touchdown.",
    "Very clean arrival. Standard professional landing.",
    "Well within limits. Comfortable touchdown."
  ],
  Firm: [
    "A bit firm, but a positive touchdown.",
    "Firm landing. Definitely felt the gear compress.",
    "A positive touchdown to prevent aquaplaning."
  ],
  Hard: [
    "Hard landing. Heavily compressed struts.",
    "Ouch! That was a rough touchdown.",
    "Hard arrival. Structural inspection might be needed."
  ],
  'Bone Shaker': [
    "Bone-shaking touchdown! That will rattle some teeth.",
    "Extremely hard impact. Main gear struts bottomed out.",
    "Severe hard landing. Cabin doors popped open!"
  ],
  Crash: [
    "CRASH! Structural failure occurred on impact.",
    "Catastrophic touchdown. The gear has disintegrated.",
    "Hull loss landing. Major emergency response triggered."
  ]
};

const passengerPools = {
  perfect: [
    "Passengers are applauding! Some are weeping with joy.",
    "A quiet cabin filled with smiles. The perfect flight.",
    "Cabin crew are beaming. High praise all around."
  ],
  good: [
    "Passengers are pleased. A comfortable and safe arrival.",
    "Standard relaxed sighs in the cabin as the spoilers deploy.",
    "Very happy passengers. Standard arrival."
  ],
  nervous: [
    "A few gasps in the cabin. People checking their seatbelts.",
    "Some nervous looks exchanged. A bit of a jolt.",
    "Nervous giggles as the cabin realizes they're down."
  ],
  angry: [
    "Audible groans from the back. Bags shifted in the overhead bins.",
    "Spilled drinks and angry murmurs throughout the cabin.",
    "A passenger is complaining about neck pain."
  ],
  lawsuit: [
    "Lawsuits pending. Whiplash alerts activated!",
    "Chaos in the cabin. Sirens, screaming, and lawyer phone calls.",
    "The FAA and legal teams have already been notified."
  ]
};

export function landingFeedback(rating: LandingRecord['rating'], sink: number, bounces: number) {
  const vs = Math.abs(sink);
  const reaction = rating === 'Crash' || vs >= 800 || bounces >= 3 ? 'lawsuit'
    : vs >= 500 || bounces === 2 ? 'angry'
    : vs >= 300 || bounces === 1 ? 'nervous'
    : vs < 160 ? 'perfect' : 'good';
  const pick = (pool: string[]) => pool[Math.floor(Math.random() * pool.length)];
  return {
    qualityFeedback: pick(qualityPools[rating === 'Smooth' ? 'Great' : rating]),
    passengerFeedback: pick(passengerPools[reaction])
  };
}
