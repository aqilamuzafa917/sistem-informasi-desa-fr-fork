import { Card, CardContent } from "@/components/ui/card";

interface VisiMisiProps {
  visi: string;
  misi: string;
}

export default function VisiMisiSection({ visi, misi }: VisiMisiProps) {
  // Parse misi text to separate intro paragraph from mission points
  const parseMisiText = (misiText: string) => {
    if (!misiText) return { intro: "", points: [] };
    const lines = misiText.split("\n").filter((line) => line.trim() !== "");

    // Find the transition point where text changes from paragraph to list format
    let introEndIndex = 0;
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].trim();
      const prevLine = lines[i - 1].trim();

      if (
        currentLine.length > 15 &&
        /^[A-Z]/.test(currentLine) &&
        (prevLine.endsWith(".") ||
          prevLine.endsWith(":") ||
          prevLine.endsWith("berikut"))
      ) {
        introEndIndex = i;
        break;
      }
    }

    const introParagraphs = lines.slice(0, introEndIndex);
    const missionPoints = lines.slice(introEndIndex);

    return {
      intro: introParagraphs.join(" "),
      points: missionPoints.filter((point) => point.trim() !== ""),
    };
  };

  const { intro, points } = parseMisiText(misi);

  return (
    <section className="w-full bg-white py-8 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Visi & Misi
        </h2>
        <div className="flex flex-col gap-8">
          {/* Visi Card */}
          <Card className="mx-auto w-full max-w-4xl shadow-lg">
            <CardContent className="p-8">
              <h3 className="mb-6 text-center text-3xl font-bold text-blue-700 dark:text-blue-400">
                Visi
              </h3>
              <div className="text-center">
                <p className="text-xl leading-relaxed font-medium text-gray-800 dark:text-gray-200">
                  {visi}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Misi Card */}
          <Card className="mx-auto w-full max-w-4xl shadow-lg">
            <CardContent className="p-8">
              <h3 className="mb-6 text-center text-3xl font-bold text-blue-700 dark:text-blue-400">
                Misi
              </h3>

              {/* Introduction paragraph */}
              {intro && (
                <div className="mb-8">
                  <p className="text-justify text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {intro}
                  </p>
                </div>
              )}

              {/* Mission points */}
              {points.length > 0 && (
                <div className="space-y-4">
                  <ol className="list-decimal space-y-4 pl-4">
                    {points.map((point, index) => (
                      <li
                        key={index}
                        className="pl-2 text-lg leading-relaxed text-gray-700 dark:text-gray-300"
                      >
                        {point.trim()}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
