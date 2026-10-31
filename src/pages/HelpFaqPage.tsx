import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  X,
  ChevronDown,
  ArrowLeft,
  Rocket,
  Bot,
  Database,
  FileCheck,
  Activity,
  LifeBuoy,
  Sparkles,
  HelpCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { FAQ_CATEGORIES, FAQ_ITEMS, type FaqItem } from '../data/faqData';

// Icon mapping helper
const categoryIcons: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="h-5 w-5" />,
  Bot: <Bot className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />,
  FileCheck: <FileCheck className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  LifeBuoy: <LifeBuoy className="h-5 w-5" />,
};

// Text highlighter component
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (terms.length === 0) {
    return <>{text}</>;
  }

  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-1 py-0.5 font-medium">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export default function HelpFaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['gs-1']));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const questionMatch = item.question.toLowerCase().includes(q);
      const answerMatch = item.answer.toLowerCase().includes(q);
      const tagMatch = item.tags.some((tag) => tag.toLowerCase().includes(q));

      return questionMatch || answerMatch || tagMatch;
    });
  }, [searchQuery, selectedCategory]);

  // Group filtered items by category
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, FaqItem[]>();
    for (const item of filteredItems) {
      if (!map.has(item.category)) {
        map.set(item.category, []);
      }
      map.get(item.category)!.push(item);
    }
    return map;
  }, [filteredItems]);

  // Popular questions
  const popularQuestions = useMemo(() => {
    return FAQ_ITEMS.filter((item) => item.isPopular);
  }, []);

  // Accordion toggle handlers
  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredItems.map((item) => item.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Select a question from popular list and expand it
  const selectQuestion = (item: FaqItem) => {
    setSelectedCategory(item.category);
    setExpandedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      const el = document.getElementById(`faq-${item.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/help#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 space-y-8 pb-16">
      {/* ─── Top Header & Back Action ──────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
            Help & FAQ
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs py-0.5">
              Knowledge Hub
            </Badge>
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Learn how RootCause AI helps you investigate incidents and identify root causes faster.
          </p>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-medium text-gray-700 shadow-xs">
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            <span>38 Guides</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-medium text-gray-700 shadow-xs">
            <Bot className="h-3.5 w-3.5 text-blue-600" />
            <span>4 Specialized Agents</span>
          </div>
        </div>
      </div>

      {/* ─── Hero Search Bar ───────────────────────────────────────────── */}
      <div className="relative max-w-3xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help, features, or questions..."
            className="w-full pl-12 pr-10 py-3.5 text-base bg-white border border-gray-300 rounded-xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results Summary */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-1">
            <span>
              Found <strong className="text-gray-900 font-semibold">{filteredItems.length}</strong> matching{' '}
              {filteredItems.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:underline font-medium"
            >
              Reset search
            </button>
          </div>
        )}
      </div>

      {/* ─── Popular Questions Chips ───────────────────────────────────── */}
      {!searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Popular Questions
          </div>
          <div className="flex flex-wrap gap-2">
            {popularQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => selectQuestion(q)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-all shadow-2xs"
              >
                <span>{q.question}</span>
                <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Category Selection Cards ──────────────────────────────────── */}
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Browse by Category
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {/* "All" button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-600'
                : 'bg-white border-border text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <BookOpen
              className={`h-5 w-5 mb-1.5 ${
                selectedCategory === 'all' ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
            <span className="text-xs font-semibold">All Topics</span>
            <span className="text-[10px] text-gray-400 mt-0.5">38 items</span>
          </button>

          {/* Individual Category Cards */}
          {FAQ_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-600'
                    : 'bg-white border-border text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div
                  className={`mb-1.5 ${
                    isSelected ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {categoryIcons[cat.iconName] || <HelpCircle className="h-5 w-5" />}
                </div>
                <span className="text-xs font-semibold line-clamp-1">{cat.name}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">{cat.itemCount} items</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Accordion Section Controls ─────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-bold text-gray-900">
          {selectedCategory === 'all'
            ? 'All Frequently Asked Questions'
            : FAQ_CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Questions'}
        </h2>
        {filteredItems.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={expandAll}
              className="text-xs h-8 px-2.5"
            >
              Expand All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={collapseAll}
              className="text-xs h-8 px-2.5"
            >
              Collapse All
            </Button>
          </div>
        )}
      </div>

      {/* ─── Empty State ────────────────────────────────────────────────── */}
      {filteredItems.length === 0 && (
        <Card className="border-dashed border-2 py-12 px-6 text-center">
          <CardContent className="flex flex-col items-center justify-center max-w-md mx-auto space-y-3">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No matching questions found</h3>
            <p className="text-sm text-gray-500">
              We couldn&apos;t find any questions or answers matching &ldquo;{searchQuery}&rdquo;. Try
              searching with different keywords or browse by category.
            </p>
            <div className="pt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Search & Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── FAQ Accordions Grouped by Category ─────────────────────────── */}
      <div className="space-y-8">
        {Array.from(groupedByCategory.entries()).map(([catId, items]) => {
          const categoryMeta = FAQ_CATEGORIES.find((c) => c.id === catId);

          return (
            <div key={catId} className="space-y-3">
              {/* Category Sub-Header */}
              {selectedCategory === 'all' && (
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-blue-600">
                      {categoryIcons[categoryMeta?.iconName || ''] || <HelpCircle className="h-4 w-4" />}
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight">
                      {categoryMeta?.name || catId}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {items.length} {items.length === 1 ? 'question' : 'questions'}
                  </span>
                </div>
              )}

              {/* Accordion Items */}
              <div className="space-y-2.5">
                {items.map((item) => {
                  const isExpanded = expandedIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      id={`faq-${item.id}`}
                      className={`rounded-xl border transition-all duration-200 bg-white ${
                        isExpanded
                          ? 'border-blue-300 ring-1 ring-blue-100 shadow-sm'
                          : 'border-border hover:border-gray-300 hover:shadow-2xs'
                      }`}
                    >
                      {/* Accordion Trigger */}
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-hidden"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-colors ${
                              isExpanded
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            ?
                          </span>
                          <div>
                            <span className="text-sm font-semibold text-gray-900 leading-snug">
                              <HighlightedText text={item.question} query={searchQuery} />
                            </span>
                            {item.isPopular && !isExpanded && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-[10px] py-0 px-1.5 bg-amber-50 text-amber-700 border-amber-200"
                              >
                                Popular
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-blue-600' : ''
                          }`}
                        />
                      </button>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 text-sm text-gray-700 border-t border-gray-100 mt-1">
                          <div className="pl-9 space-y-3">
                            <div className="leading-relaxed whitespace-pre-line font-normal text-gray-600">
                              <HighlightedText text={item.answer} query={searchQuery} />
                            </div>

                            {/* Tags & Action row */}
                            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 text-xs text-gray-400">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] text-gray-400 font-medium">Tags:</span>
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px]"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleCopyLink(item.id)}
                                className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                              >
                                {copiedId === item.id ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                    <span className="text-emerald-600">Link copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    <span>Copy link</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Still Need Help? Section ───────────────────────────────────── */}
      <Card className="bg-linear-to-br from-blue-50/70 via-white to-indigo-50/50 border border-blue-200 mt-12 rounded-2xl overflow-hidden shadow-xs">
        <CardContent className="p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                <LifeBuoy className="h-3.5 w-3.5" />
                <span>Operational Guidance</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Still have questions or facing an issue?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                RootCause AI combines pgvector hybrid retrieval, multi-agent reasoning, and real-time trace
                observability. Explore the Knowledge Base or inspect active investigations to see the AI in action.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Link to="/knowledge">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium">
                  <Database className="h-4 w-4 mr-2" />
                  Knowledge Base
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto font-medium">
                  <Activity className="h-4 w-4 mr-2" />
                  View Incidents
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
