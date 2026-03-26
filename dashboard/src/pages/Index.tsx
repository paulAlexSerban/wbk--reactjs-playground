import { useState } from 'react';
import { Header } from '@/components/portfolio/Header';
import { SearchBar } from '@/components/portfolio/SearchBar';
import { ViewToggle } from '@/components/portfolio/ViewToggle';
import { FilterControls } from '@/components/portfolio/FilterControls';
import { FeaturedSection } from '@/components/portfolio/FeaturedSection';
import { ProjectGrid } from '@/components/portfolio/ProjectGrid';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import { Pagination } from '@/components/portfolio/Pagination';
import { SourceTypeTabs } from '@/components/portfolio/SourceTypeTabs';
import { ExperimentsInfo } from '@/components/portfolio/ExperimentsInfo';
import { useProjects } from '@/hooks/useProjects';
import { projects as allProjectsCatalog } from '@/data/projects';
import { Project } from '@/types/project';

const Index = () => {
    const {
        projects,
        filters,
        updateFilter,
        resetFilters,
        viewMode,
        setViewMode,
        currentPage,
        setCurrentPage,
        totalPages,
        totalResults,
    } = useProjects();

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    const showFeatured =
        filters.sourceType !== 'experiment' &&
        !filters.search &&
        filters.categories.length === 0 &&
        filters.techStack.length === 0;
    const hasActiveFilters = Boolean(filters.search) || filters.categories.length > 0 || filters.techStack.length > 0;
    const totalProjectsInScope =
        filters.sourceType === 'all'
            ? allProjectsCatalog.length
            : allProjectsCatalog.filter((project) => project.sourceType === filters.sourceType).length;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container py-8">
                {/* Source type tabs: All / Apps / Experiments */}
                <SourceTypeTabs value={filters.sourceType} onChange={(val) => updateFilter('sourceType', val)} />

                {/* Experiments info banner */}
                {filters.sourceType === 'experiment' && <ExperimentsInfo />}

                {/* Featured Section */}
                {showFeatured && <FeaturedSection onProjectClick={handleProjectClick} />}

                {/* Controls */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <SearchBar value={filters.search} onChange={(value) => updateFilter('search', value)} />
                        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                    </div>
                    <FilterControls
                        filters={filters}
                        updateFilter={updateFilter}
                        resetFilters={resetFilters}
                        totalResults={totalResults}
                    />
                </div>

                {/* Project Grid */}
                <div
                    id={`source-type-panel-${filters.sourceType}`}
                    role="tabpanel"
                    aria-labelledby={`source-type-tab-${filters.sourceType}`}
                >
                    <ProjectGrid
                        projects={projects}
                        viewMode={viewMode}
                        onProjectClick={handleProjectClick}
                        sourceType={filters.sourceType}
                        hasActiveFilters={hasActiveFilters}
                        totalProjectsInScope={totalProjectsInScope}
                    />
                </div>

                {/* Pagination */}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </main>

            {/* Project Modal */}
            <ProjectModal project={selectedProject} open={modalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Index;
