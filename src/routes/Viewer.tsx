import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { RepoTarget, FetchError } from '../lib/types';
import { decodePath } from '../lib/githubUrl';
import { fetchMarkdown } from '../lib/fetchers';
import { Layout } from '../components/Layout';
import { MarkdownView } from '../components/MarkdownView';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';

export function Viewer() {
  const { owner, repo, branch, '*': path } = useParams<{
    owner: string;
    repo: string;
    branch: string;
    '*': string;
  }>();
  
  const [target, setTarget] = useState<RepoTarget | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FetchError | null>(null);
  
  useEffect(() => {
    if (!owner || !repo || !branch || !path) {
      setError({
        status: 400,
        message: 'Invalid URL parameters',
      });
      setLoading(false);
      return;
    }
    
    const decodedPath = decodePath(path);
    const newTarget: RepoTarget = {
      owner,
      repo,
      branch,
      path: decodedPath,
    };
    
    setTarget(newTarget);
    setLoading(true);
    setError(null);
    
    // Flag to prevent state updates if component unmounts
    let cancelled = false;
    
    fetchMarkdown(newTarget)
      .then((text) => {
        if (!cancelled) {
          setContent(text);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: FetchError) => {
        if (!cancelled) {
          setError(err);
          setContent('');
          setLoading(false);
        }
      });
    
    return () => {
      cancelled = true;
    };
  }, [owner, repo, branch, path]);
  
  const handleRetry = () => {
    if (target) {
      setLoading(true);
      setError(null);
      
      fetchMarkdown(target)
        .then((text) => {
          setContent(text);
          setError(null);
        })
        .catch((err: FetchError) => {
          setError(err);
          setContent('');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  if (!target) {
    return (
      <div style={{ padding: '2rem' }}>
        <ErrorState
          error={{ status: 400, message: 'Invalid URL parameters' }}
        />
      </div>
    );
  }
  
  if (loading) {
    return (
      <Layout target={target} content="">
        <LoadingState />
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout target={target} content="">
        <ErrorState error={error} onRetry={handleRetry} />
      </Layout>
    );
  }
  
  return (
    <Layout target={target} content={content}>
      <MarkdownView content={content} target={target} />
    </Layout>
  );
}

