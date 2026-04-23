import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCase } from "@/hooks/use-case";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateDiaryEntry } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const activities = ["Körperpflege", "Ernährung", "Mobilität", "Hauswirtschaft", "Soziale Betreuung", "Medizinische Versorgung"];

export function TagebuchNeu() {
  const { caseCode, initializeCase } = useCase();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createEntry = useCreateDiaryEntry();

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hours, setHours] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [mobility, setMobility] = useState<"independent" | "assisted" | "dependent" | undefined>();
  const [mood, setMood] = useState<"good" | "moderate" | "poor" | undefined>();

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let currentCode = caseCode;
    if (!currentCode) {
      currentCode = await initializeCase("tagebuch");
      if (!currentCode) return;
    }

    try {
      await createEntry.mutateAsync({
        data: {
          caseCode: currentCode,
          entryDate: new Date(date).toISOString(),
          careHours: hours ? parseFloat(hours) : null,
          careActivities: selectedActivities,
          notes,
          mobility,
          mood
        }
      });
      toast({ title: "Eintrag gespeichert!" });
      setLocation("/tagebuch/uebersicht");
    } catch (e) {
      toast({ title: "Fehler", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Neuer Tagebucheintrag</h2>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Datum</Label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Pflegestunden (geschätzt)</Label>
                <Input type="number" step="0.5" value={hours} onChange={e => setHours(e.target.value)} placeholder="z.B. 2.5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Aktivitäten</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activities.map(act => (
                  <div key={act} className="flex items-center space-x-2">
                    <Checkbox id={act} checked={selectedActivities.includes(act)} onCheckedChange={() => toggleActivity(act)} />
                    <Label htmlFor={act} className="font-normal">{act}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mobilität</Label>
                <Select value={mobility} onValueChange={(val: any) => setMobility(val)}>
                  <SelectTrigger><SelectValue placeholder="Bitte wählen..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="independent">Selbstständig</SelectItem>
                    <SelectItem value="assisted">Mit Hilfe</SelectItem>
                    <SelectItem value="dependent">Unselbstständig</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stimmung</Label>
                <Select value={mood} onValueChange={(val: any) => setMood(val)}>
                  <SelectTrigger><SelectValue placeholder="Bitte wählen..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Gut</SelectItem>
                    <SelectItem value="moderate">Mittelmäßig</SelectItem>
                    <SelectItem value="poor">Schlecht</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notizen / Besonderheiten</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => setLocation("/tagebuch/uebersicht")}>Abbrechen</Button>
              <Button type="submit" disabled={createEntry.isPending}>Speichern</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
