import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";


const ArticleCard = ({ articles = [], onClick}) => {
    if(!articles.length) {
        return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg font-medium">Sadly, no articles exist for this tag, but come back tommorow and maybe there will be something new!
            We update our page every day!
        </p>
      </div>
    );
  }

    return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Related Articles
      </h2>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Card
            key={index}
            className="flex justify-between items-center p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100"
          >
            <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full p-0">
              <div className="flex-1 mb-3 sm:mb-0">
                <h3 className="font-medium text-gray-800 text-lg">
                  {article.title}
                </h3>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#00b8d9] hover:underline flex items-center gap-1"
                >
                  Visit Article <ExternalLink size={14} />
                </a>
              </div>

              <Button
                onClick={() => onAction(article)}
                className="bg-[#00b8d9] hover:bg-[#00a0bf] text-white rounded-xl px-4 py-2"
              >
                Take Action
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LinkTree;




    }
