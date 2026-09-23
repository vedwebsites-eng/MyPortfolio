import React, { useState, useEffect } from 'react';
import { Github, GitCommit, GitBranch, ExternalLink, RefreshCw } from 'lucide-react';

interface GitHubStats {
  login: string;
  avatarUrl: string;
  profileUrl: string;
  publicRepos: number;
  latestRepoName: string;
  latestRepoUrl: string;
  latestRepoLanguage: string | null;
  latestRepoUpdated: string;
}

export const GitHubLiveStat: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchGitHubData() {
      try {
        setLoading(true);
        // Fetch user data
        const userRes = await fetch('https://api.github.com/users/vedwebsites-eng', {
          headers: { Accept: 'application/vnd.github.v3+json' },
        });

        if (!userRes.ok) {
          throw new Error(`GitHub user API returned ${userRes.status}`);
        }
        const userData = await userRes.json();

        // Fetch latest updated repository
        const repoRes = await fetch(
          'https://api.github.com/users/vedwebsites-eng/repos?sort=updated&per_page=1',
          {
            headers: { Accept: 'application/vnd.github.v3+json' },
          }
        );

        let latestRepoName = 'AETHOS';
        let latestRepoUrl = 'https://github.com/vedwebsites-eng';
        let latestRepoLanguage = 'TypeScript';
        let latestRepoUpdated = new Date().toISOString();

        if (repoRes.ok) {
          const repoData = await repoRes.json();
          if (Array.isArray(repoData) && repoData.length > 0) {
            latestRepoName = repoData[0].name;
            latestRepoUrl = repoData[0].html_url;
            latestRepoLanguage = repoData[0].language || 'TypeScript';
            latestRepoUpdated = repoData[0].updated_at;
          }
        }

        if (isMounted) {
          setStats({
            login: userData.login || 'vedwebsites-eng',
            avatarUrl: userData.avatar_url || '',
            profileUrl: userData.html_url || 'https://github.com/vedwebsites-eng',
            publicRepos: typeof userData.public_repos === 'number' ? userData.public_repos : 3,
            latestRepoName,
            latestRepoUrl,
            latestRepoLanguage,
            latestRepoUpdated,
          });
          setHasError(false);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('GitHub live stat fetch skipped (network/rate-limit):', err);
          setHasError(true);
          setLoading(false);
        }
      }
    }

    fetchGitHubData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Gracefully hide the block entirely if fetch fails or is still loading
  if (hasError || loading || !stats) {
    return null;
  }

  const formattedDate = new Date(stats.latestRepoUpdated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      id="github-live-stat-card"
      className="mt-12 p-4 sm:p-5 rounded-xl bg-[#090d14]/90 border border-white/10 hover:border-emerald-500/30 transition-all font-mono text-xs shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Header indicator and profile info */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
            <Github className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live from GitHub</span>
              </span>
              <span className="text-zinc-600">//</span>
              <a
                href={stats.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-emerald-400 transition-colors font-semibold"
              >
                @{stats.login}
              </a>
            </div>
            <div className="text-zinc-400 text-[11px] mt-0.5">
              <span>{stats.publicRepos} public repositories</span>
              <span className="text-zinc-600 mx-1.5">•</span>
              <span className="text-zinc-500">Autonomous OSS & AppSec</span>
            </div>
          </div>
        </div>

        {/* Latest Activity Chip */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 flex items-center sm:justify-end space-x-1">
              <GitBranch className="w-3 h-3 text-cyan-400" />
              <span>Latest push</span>
            </div>
            <a
              href={stats.latestRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-emerald-200 transition-colors font-medium flex items-center space-x-1 text-xs"
            >
              <span>{stats.latestRepoName}</span>
              {stats.latestRepoLanguage && (
                <span className="text-[10px] text-zinc-500">({stats.latestRepoLanguage})</span>
              )}
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>

          <div className="text-[10px] text-zinc-500 bg-white/5 border border-white/10 px-2 py-1 rounded">
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
};
