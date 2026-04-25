import { useCase } from "@/hooks/use-case";
import { useGetScores } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Sgb14Ergebnis() {
  const { caseCode } = useCase();
  const { data: scores, isLoading } = useGetScores(caseCode || "", { module: "sgb14" }, {
    query: { enabled: !!caseCode }
  });

  if (isLoading) return <div className="p-12 text-center">Lade Ergebnis...</div>;

  const score = scores?.[0];

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Ergebnis SGB XIV</h1>
      {score ? (
        <Card>
          <CardContent className="p-8">
            <Badge className="mb-4" variant="outline">Prüfung empfohlen</Badge>
            <h2 className="text-2xl font-bold mb-4">{score.resultText}</h2>
            <p className="text-muted-foreground mb-6">Orientierungshinweis: Opferentschädigungsrecht ist komplex. Diese Einschätzung ersetzt keine rechtliche Beratung.</p>
            {score.recommendedActions && (
              <ul className="list-disc pl-5 space-y-2">
                {score.recommendedActions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : (
        <p>Kein Ergebnis gefunden.</p>
      )}
    </div>
  );
}
export default Sgb14Ergebnis;
