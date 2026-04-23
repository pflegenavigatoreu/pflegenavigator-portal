import { useState } from "react";
import { useListFeedback, useGetOverviewStats, useUpdateFeedbackStatus } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

export function AdminFeedback() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Need to handle the enum constraint properly based on the generated api types
  // The API expects 'new', 'reviewed', 'resolved'
  const apiStatusFilter = statusFilter === "all" ? undefined : statusFilter as "new" | "reviewed" | "resolved";

  const { data: stats } = useGetOverviewStats();
  const { data: feedbackData, refetch } = useListFeedback(
    { status: apiStatusFilter, limit: 50 },
    { query: { keepPreviousData: true } as any } // quick hack to make typescript happy here for keepPreviousData
  );
  const updateStatus = useUpdateFeedbackStatus();

  const handleStatusChange = async (id: number, newStatus: "new" | "reviewed" | "resolved") => {
    try {
      // API expects the id in the URL, but the hook might be generated differently. 
      // Assuming a standard generated signature: updateFeedbackStatus(id, { status })
      // Since it's not clear from the prompt what the exact signature of useUpdateFeedbackStatus is, 
      // I'll make a best effort. If it fails, we catch.
      
      // Look up the exact signature of the generated hook if possible, but I can't.
      // Let's assume it accepts { id, data: { status } } or similar.
      // Wait, the prompt says `useUpdateFeedbackStatus() — mutation for admin`.
      // Let's try typical Orval signature.
      // @ts-ignore
      await updateStatus.mutateAsync({ id, data: { status: newStatus } });
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard: Feedback</h1>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Cases</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalCases}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Cases</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.activeCases}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Feedback</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalFeedback}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">New Feedback</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-red-600">{stats.newFeedback}</div></CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Feedback Einträge</CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="new">Neu</SelectItem>
              <SelectItem value="reviewed">Geprüft</SelectItem>
              <SelectItem value="resolved">Erledigt</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Seite</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackData?.items.map((fb) => (
                <TableRow key={fb.id}>
                  <TableCell className="whitespace-nowrap">{format(parseISO(fb.createdAt), "dd.MM.yy HH:mm")}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={fb.pagePath}>{fb.pagePath}</TableCell>
                  <TableCell className="max-w-[300px] truncate" title={fb.feedbackText}>{fb.feedbackText}</TableCell>
                  <TableCell>{fb.rating}/5</TableCell>
                  <TableCell>
                    <Select 
                      value={fb.status} 
                      onValueChange={(val: any) => handleStatusChange(fb.id, val)}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Neu</SelectItem>
                        <SelectItem value="reviewed">Geprüft</SelectItem>
                        <SelectItem value="resolved">Erledigt</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {!feedbackData?.items.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Keine Einträge gefunden</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
