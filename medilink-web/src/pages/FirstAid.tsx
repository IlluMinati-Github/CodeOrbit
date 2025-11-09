import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { Heart, Zap, Droplet, Thermometer, AlertCircle, Bandage, Search, X, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEmergencyNumber } from "@/hooks/useEmergencyNumber";

type FirstAidTopic = {
  icon: typeof Heart;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  keywords: string[];
  steps: string[];
  importantNotes: string[];
  whenToCall911: string[];
};

const FirstAid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const { emergencyNumber } = useEmergencyNumber();

  const firstAidTopics: FirstAidTopic[] = useMemo(() => [
    {
      icon: Heart,
      title: "CPR",
      description: "Cardiopulmonary resuscitation steps",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      keywords: ["cpr", "cardiac arrest", "heart", "resuscitation", "breathing", "chest compressions"],
      steps: [
        "Check for responsiveness: Tap the person's shoulder and shout 'Are you okay?'",
        `Call ${emergencyNumber} immediately or ask someone else to call`,
        "Check for breathing: Look for chest rise, listen for breath sounds, feel for breath on your cheek",
        "If not breathing, start chest compressions: Place heel of one hand on center of chest, place other hand on top, interlock fingers",
        "Push hard and fast: Compress chest at least 2 inches deep at rate of 100-120 compressions per minute",
        "Give rescue breaths: After 30 compressions, tilt head back, lift chin, pinch nose, give 2 breaths (1 second each)",
        "Continue cycles: Alternate 30 compressions with 2 breaths until help arrives or person shows signs of life",
        "Use AED if available: Follow the device's voice prompts"
      ],
      importantNotes: [
        "Only perform CPR if the person is unresponsive and not breathing normally",
        "Do not stop CPR unless the person shows signs of life or medical help arrives",
        "If you're untrained, perform hands-only CPR (chest compressions only)"
      ],
      whenToCall911: [
        "Person is unresponsive",
        "No breathing or only gasping",
        "No pulse detected"
      ]
    },
    {
      icon: Bandage,
      title: "Wound Care",
      description: "Treating cuts and injuries",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      keywords: ["wound", "cut", "injury", "bleeding", "bandage", "dressing"],
      steps: [
        "Wash your hands thoroughly with soap and water",
        "Stop the bleeding: Apply gentle pressure with a clean cloth or bandage",
        "Clean the wound: Rinse with cool running water to remove dirt and debris",
        "Apply antiseptic: Use hydrogen peroxide or antiseptic solution if available",
        "Cover the wound: Apply a sterile bandage or dressing",
        "Change dressing daily: Keep the wound clean and dry",
        "Watch for signs of infection: Redness, swelling, pus, or increased pain"
      ],
      importantNotes: [
        "Do not remove objects embedded in the wound - seek medical help",
        "For deep wounds or wounds that won't stop bleeding, seek immediate medical attention",
        "Keep the wound elevated above heart level if possible to reduce bleeding"
      ],
      whenToCall911: [
        "Bleeding won't stop after 10 minutes of direct pressure",
        "Wound is deep or gaping",
        "Object is embedded in the wound",
        "Signs of infection develop"
      ]
    },
    {
      icon: Zap,
      title: "Choking",
      description: "Heimlich maneuver guide",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      keywords: ["choking", "heimlich", "airway", "blocked", "suffocation"],
      steps: [
        "Recognize choking: Person cannot speak, cough, or breathe, may clutch throat",
        "For adults/children over 1 year: Stand behind the person, wrap arms around their waist",
        "Make a fist: Place thumb side of fist against the person's abdomen, just above navel",
        "Grasp fist with other hand: Press into abdomen with quick upward thrusts",
        "Repeat thrusts: Continue until object is expelled or person becomes unconscious",
        "For infants under 1 year: Hold face down on your forearm, support head and neck, give 5 back blows between shoulder blades, then 5 chest thrusts",
        `If person becomes unconscious: Lower to ground, call ${emergencyNumber}, begin CPR`
      ],
      importantNotes: [
        "Only perform Heimlich maneuver if the person is truly choking and cannot cough or speak",
        "Do not perform on someone who is coughing - encourage them to keep coughing",
        "For pregnant or obese people, perform chest thrusts instead of abdominal thrusts"
      ],
      whenToCall911: [
        "Person cannot breathe, speak, or cough",
        "Person becomes unconscious",
        "Choking persists after attempts to clear airway"
      ]
    },
    {
      icon: Thermometer,
      title: "Burns",
      description: "First aid for burns",
      color: "text-primary",
      bgColor: "bg-primary/10",
      keywords: ["burn", "scald", "fire", "heat", "thermal", "chemical"],
      steps: [
        "Stop the burning process: Remove person from source of burn, remove hot or burned clothing (if not stuck to skin)",
        "Cool the burn: Hold burned area under cool (not cold) running water for 10-20 minutes",
        "Cover the burn: Use a clean, dry cloth or sterile bandage",
        "Do not break blisters: Leave intact to prevent infection",
        "Do not apply ice: Ice can cause further damage to the skin",
        "Do not apply butter, oil, or ointments: These can trap heat and cause infection",
        "Take pain reliever: Use over-the-counter pain medication if needed",
        "Watch for signs of shock: Keep person calm and comfortable"
      ],
      importantNotes: [
        "First-degree burns (red, painful): Usually heal on their own",
        "Second-degree burns (blisters, severe pain): May need medical attention",
        "Third-degree burns (white or charred, no pain): Require immediate medical attention",
        "For chemical burns, flush with water for at least 20 minutes"
      ],
      whenToCall911: [
        "Burns cover large area of body",
        "Third-degree burns",
        "Burns on face, hands, feet, or genitals",
        "Chemical or electrical burns",
        "Signs of smoke inhalation"
      ]
    },
    {
      icon: Droplet,
      title: "Bleeding",
      description: "How to stop bleeding",
      color: "text-red-600",
      bgColor: "bg-red-600/10",
      keywords: ["bleeding", "hemorrhage", "blood", "wound", "cut"],
      steps: [
        "Apply direct pressure: Use a clean cloth or bandage and press directly on the wound",
        "Elevate the injured area: Raise it above the level of the heart if possible",
        "Maintain pressure: Keep pressure for at least 5-10 minutes without checking",
        "Add more layers: If blood soaks through, add more cloth on top - do not remove original",
        "Apply pressure to pressure points: If direct pressure doesn't work, press on artery above wound",
        "Keep person calm: Anxiety can increase heart rate and bleeding",
        "Do not remove embedded objects: Stabilize object and seek medical help"
      ],
      importantNotes: [
        "Do not use a tourniquet unless bleeding is life-threatening and cannot be controlled",
        "Wear gloves if available to protect yourself from bloodborne pathogens",
        "For nosebleeds: Sit upright, lean forward, pinch nostrils for 10 minutes"
      ],
      whenToCall911: [
        "Bleeding won't stop after 10 minutes of direct pressure",
        "Bleeding is severe or spurting",
        "Person shows signs of shock (pale, dizzy, weak pulse)",
        "Large amount of blood loss"
      ]
    },
    {
      icon: AlertCircle,
      title: "Shock",
      description: "Recognizing and treating shock",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      keywords: ["shock", "circulatory", "collapse", "fainting", "weak pulse"],
      steps: [
        "Recognize symptoms: Pale or gray skin, cool and clammy, rapid weak pulse, rapid shallow breathing, confusion, dizziness, weakness",
        `Call ${emergencyNumber} immediately: Shock is a medical emergency`,
        "Have person lie down: Elevate legs about 12 inches unless injury prevents this",
        "Keep person warm: Cover with blanket or coat, but do not overheat",
        "Loosen tight clothing: Remove or loosen belts, collars, and restrictive clothing",
        "Do not give food or water: Person may need surgery",
        "Monitor breathing: Be prepared to perform CPR if person stops breathing",
        "Treat cause if possible: Control bleeding, treat injuries"
      ],
      importantNotes: [
        "Shock can be life-threatening and requires immediate medical attention",
        "Do not elevate legs if person has head, neck, or back injury",
        "Keep person calm and reassure them while waiting for help"
      ],
      whenToCall911: [
        "Any signs of shock",
        "Person is unconscious or unresponsive",
        "Rapid or weak pulse",
        "Pale, cool, clammy skin"
      ]
    }
  ], [emergencyNumber]);

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return firstAidTopics;
    const query = searchQuery.toLowerCase();
    return firstAidTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.keywords.some((keyword) => keyword.includes(query))
    );
  }, [searchQuery]);

  const selectedTopicData = firstAidTopics.find((topic) => topic.title === selectedTopic);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 overflow-auto md:ml-64">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pt-16 md:pt-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">First Aid Guide</h1>
            <p className="text-sm md:text-base text-muted-foreground">Quick access to emergency procedures and life-saving techniques</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 md:mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search first aid topics (e.g., CPR, bleeding, burns, choking)..."
                className="pl-10 pr-10 rounded-[13px] h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-muted-foreground">
                Found {filteredTopics.length} result{filteredTopics.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {selectedTopicData ? (
            /* Detailed View */
            <div className="space-y-6">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => setSelectedTopic(null)}
              >
                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                Back to Topics
              </Button>

              <Card className="card-soft border-0">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-[13px] ${selectedTopicData.bgColor} flex items-center justify-center`}>
                      <selectedTopicData.icon className={`h-8 w-8 ${selectedTopicData.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-heading">{selectedTopicData.title}</CardTitle>
                      <CardDescription className="text-base mt-1">{selectedTopicData.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Steps */}
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      Step-by-Step Instructions
                    </h3>
                    <ol className="space-y-3 ml-10">
                      {selectedTopicData.steps.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Important Notes */}
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-[13px]">
                    <h3 className="text-lg font-heading font-bold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      Important Notes
                    </h3>
                    <ul className="space-y-2 ml-7">
                      {selectedTopicData.importantNotes.map((note, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-yellow-600 mt-1">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* When to Call Emergency */}
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-[13px]">
                    <h3 className="text-lg font-heading font-bold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      When to Call {emergencyNumber}
                    </h3>
                    <ul className="space-y-2 ml-7">
                      {selectedTopicData.whenToCall911.map((reason, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Topics Grid */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                {filteredTopics.map((topic) => {
                  const Icon = topic.icon;
                  return (
                    <Card
                      key={topic.title}
                      className="card-soft card-hover border-0 cursor-pointer transition-all"
                      onClick={() => setSelectedTopic(topic.title)}
                    >
                      <CardContent className="p-6">
                        <div className={`w-14 h-14 rounded-[13px] ${topic.bgColor} flex items-center justify-center mb-4`}>
                          <Icon className={`h-7 w-7 ${topic.color}`} />
                        </div>
                        <h3 className="text-xl font-heading font-bold mb-2">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="rounded-[8px]">
                            {topic.steps.length} steps
                          </Badge>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredTopics.length === 0 && (
                <Card className="card-soft border-0">
                  <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-bold mb-2">No results found</h3>
                    <p className="text-muted-foreground">
                      Try searching for "CPR", "bleeding", "burns", "choking", "wound care", or "shock"
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Emergency Notice */}
              <Card className="card-soft border-0 bg-destructive/5 border-destructive/20">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-destructive mb-1">Emergency Notice</h3>
                      <p className="text-sm text-muted-foreground">
                        In case of a serious emergency, always call {emergencyNumber} or your local emergency number immediately. 
                        This guide is for informational purposes and should not replace professional medical care. 
                        Always seek professional medical attention for serious injuries or medical emergencies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default FirstAid;
