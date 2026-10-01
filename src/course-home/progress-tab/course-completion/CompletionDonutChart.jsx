import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import { useContextId } from '../../../data/hooks';
import { useModel } from '../../../generic/model-store';

import CompleteDonutSegment from './CompleteDonutSegment';
import IncompleteDonutSegment from './IncompleteDonutSegment';
import LockedDonutSegment from './LockedDonutSegment';
import messages from './messages';

const CompletionDonutChart = () => {
  const intl = useIntl();
  const courseId = useContextId();

  const {
    completionSummary: {
      completeCount,
      incompleteCount,
      lockedCount,
    },
  } = useModel('progress', courseId);

  const numTotalUnits = completeCount + incompleteCount + lockedCount;
  const completePercentage = completeCount ? Number(((completeCount / numTotalUnits) * 100).toFixed(0)) : 0;
  const lockedPercentage = lockedCount ? Number(((lockedCount / numTotalUnits) * 100).toFixed(0)) : 0;
  const incompletePercentage = 100 - completePercentage - lockedPercentage;

  const isLocaleRtl = isRtl(getLocale());

  return (
    <>
      <svg role="img" width="100%" height="100%" viewBox="0 0 42 42" className="donut" style={{ maxWidth: '200px' }} aria-hidden="true">
        {/* Círculo de fondo más grande */}
        <circle className="donut-hole" fill="#fff" cx="21" cy="21" r="19" stroke="#e9ecef" strokeWidth="1" />
        
        {/* Círculo interior para el contenido - más grande para el texto */}
        <circle fill="rgba(90, 18, 44, 0.05)" cx="21" cy="21" r="16" />
        
        <g className="donut-chart-text">
          <text x="50%" y="46%" className="donut-chart-number">
            {completePercentage}{isLocaleRtl && '\u200f'}%
          </text>
          <text x="50%" y="65%" className="donut-chart-label">
            {intl.formatMessage(messages.donutLabel)}
          </text>
        </g>
        
        {/* Progreso como borde del círculo exterior */}
        <circle
          fill="none"
          cx="21"
          cy="21"
          r="19"
          stroke="#e9ecef"
          strokeWidth="3"
        />
        <circle
          fill="none"
          cx="21"
          cy="21"
          r="19"
          stroke="url(#progressGradient)"
          strokeWidth="3"
          strokeDasharray={`${(completePercentage / 100) * 119.38} 119.38`}
          strokeDashoffset="0"
          strokeLinecap="round"
          transform="rotate(-90 21 21)"
        />
        
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e6dbc7" />
            <stop offset="100%" stopColor="#a86a2c" />
          </linearGradient>
        </defs>
      </svg>
      <div className="sr-only">
        {intl.formatMessage(messages.percentComplete, { percent: completePercentage })}
        {intl.formatMessage(messages.percentIncomplete, { percent: incompletePercentage })}
        {lockedPercentage > 0 && (
          <>
            {intl.formatMessage(messages.percentLocked, { percent: lockedPercentage })}
          </>
        )}
      </div>
    </>
  );
};

export default CompletionDonutChart;
